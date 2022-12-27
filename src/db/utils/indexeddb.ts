import { QuestionSaveResolveType } from "~core/enums/question-save-resolve-type";
import type { IQuestionSaveResolver } from "~core/interfaces/question-save-resolver";
import type { Question } from "~core/models/question";
import type { QuestionsImportStatus } from "~core/types/questions-import-status";

import { QuestionSaveResolverFactory } from "./saver-resolvers/question-save-resolver-factory";

declare type Entity = {
    key: string;
    question: Question;
};

class Cache {
    static database: IDBDatabase;
}

const databaseName: string = "QuestionsDB";
const storeName: string = "QuestionsStore";

function openDatabase(): Promise<IDBDatabase> {
    return new Promise((onOpened, reject) => {
        let db: IDBDatabase;

        if ((db = Cache.database)) {
            onOpened(db);
        }

        const openRequest: IDBOpenDBRequest = indexedDB.open(databaseName);
        openRequest.onerror = (reason) => {
            reject(reason);
        };
        openRequest.onupgradeneeded = (event: any) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: "key" });
            }
        };
        openRequest.onsuccess = (event: any) => {
            db = db || event.target.result;
            onOpened(db);
        };
    });
}

function createTransaction(db: IDBDatabase, mode: IDBTransactionMode): IDBTransaction {
    return db.transaction(storeName, mode);
}

function createReadonlyTransaction(db: IDBDatabase): IDBTransaction {
    return createTransaction(db, "readonly");
}

function createReadWriteTransaction(db: IDBDatabase): IDBTransaction {
    return createTransaction(db, "readwrite");
}

export async function importQuestions(newQuestions: Map<string, Question>): Promise<QuestionsImportStatus> {
    return new Promise((onImported) => {
        let entities: Entity[] = [];
        let enitityPromises: Promise<void>[] = [];
        let importStatus: QuestionsImportStatus = { written: 0, merged: 0, ignored: 0, failed: 0 };

        newQuestions.forEach((questionToImport, questionKey) => {
            enitityPromises.push(
                new Promise((onFinished, reject) => {
                    let resolver: IQuestionSaveResolver = QuestionSaveResolverFactory.getQuestionSaveResolver(questionToImport.type);
                    resolver
                        .resolve(questionToImport, questionKey)
                        .then((status) => {
                            let questionToSave: Question = status.question;

                            switch (status.type) {
                                case QuestionSaveResolveType.Ignore:
                                    importStatus.ignored++;
                                    break;
                                case QuestionSaveResolveType.Merge:
                                    importStatus.merged++;
                                    entities.push({ key: questionKey, question: questionToSave });
                                    break;
                                case QuestionSaveResolveType.Write:
                                    importStatus.written++;
                                    entities.push({ key: questionKey, question: questionToSave });
                                    break;
                            }
                            onFinished();
                        })
                        .catch(() => {
                            importStatus.failed++;
                            reject();
                        });
                })
            );
        });

        Promise.allSettled(enitityPromises).then(() => {
            saveQuestions(entities).then(() => onImported(importStatus));
        });
    });
}

export async function saveQuestion(questionKey: string, question: Question): Promise<void> {
    let resolver: IQuestionSaveResolver = QuestionSaveResolverFactory.getQuestionSaveResolver(question.type);
    return resolver.resolve(question, questionKey).then(
        (status) => {
            question = status.question;

            switch (status.type) {
                case QuestionSaveResolveType.Merge:
                case QuestionSaveResolveType.Write:
                    openDatabase().then((db) => {
                        let tx = createReadWriteTransaction(db);
                        tx.oncomplete = () => Promise.resolve();
                        tx.onerror = (reason) => Promise.reject(reason);

                        let store: IDBObjectStore = tx.objectStore(storeName);
                        store.put({ key: questionKey, question: question });
                    });
                    break;
            }
        },
        (reason) => {
            let message: string = `Failed to resolve question "${questionKey}"`;
            console.log(message);
            console.debug(message, reason);
        }
    );
}

export async function saveQuestions(entities: Entity[]): Promise<void> {
    return new Promise((onAllSaved, reject) => {
        openDatabase()
            .then((db) => {
                let tx = createReadWriteTransaction(db);
                tx.oncomplete = () => {
                    onAllSaved();
                };
                tx.onerror = (reason) => {
                    reject(reason);
                };

                let store: IDBObjectStore = tx.objectStore(storeName);
                entities.forEach((entity) => {
                    console.debug("Question to save", entity);
                    store.put(entity);
                });
            })
            .catch((reason) => {
                reject(reason);
            });
    });
}

export async function retrieveQuestion(questionKey: string): Promise<Question> {
    return new Promise((onRetrieved, reject) => {
        openDatabase()
            .then((db) => {
                let question: Question;
                let tx = createReadonlyTransaction(db);
                tx.oncomplete = () => {
                    onRetrieved(question);
                };
                tx.onerror = (reason) => {
                    reject(reason);
                };

                let store: IDBObjectStore = tx.objectStore(storeName);
                let request: IDBRequest = store.get(questionKey);
                request.onsuccess = (event: any) => {
                    question = event.target.result?.question;
                };
            })
            .catch((reason) => {
                reject(reason);
            });
    });
}

export async function retrieveAllQuestions(): Promise<Map<string, Question>> {
    return new Promise((onRetrieved, reject) => {
        openDatabase()
            .then((db) => {
                let questions: Map<string, Question> = new Map();
                let tx = createReadonlyTransaction(db);
                tx.oncomplete = () => {
                    onRetrieved(questions);
                };
                tx.onerror = (reason) => {
                    reject(reason);
                };

                let store = tx.objectStore(storeName);
                let request: IDBRequest = store.getAll();
                request.onsuccess = (event: any) => {
                    let documents: Entity[] = event.target.result;
                    documents.forEach((d) => questions.set(d.key, d.question));
                };
            })
            .catch((reason) => {
                reject(reason);
            });
    });
}

export async function retrieveQuestionsCount(): Promise<number> {
    return new Promise((onRetrieved, reject) => {
        openDatabase()
            .then((db) => {
                let count: number;
                let tx = createReadonlyTransaction(db);
                tx.oncomplete = () => {
                    onRetrieved(count);
                };
                tx.onerror = (reason) => {
                    reject(reason);
                };

                let store = tx.objectStore(storeName);
                let request: IDBRequest = store.count();
                request.onsuccess = (event: any) => {
                    count = event.target.result;
                };
            })
            .catch((reason) => {
                reject(reason);
            });
    });
}

export async function removeAllQuestions(): Promise<void> {
    return new Promise((onRemoved, reject) => {
        openDatabase()
            .then((db) => {
                let tx = createReadWriteTransaction(db);
                tx.oncomplete = () => {
                    onRemoved();
                };
                tx.onerror = (reason) => {
                    reject(reason);
                };

                let store = tx.objectStore(storeName);
                store.clear();
            })
            .catch((reason) => {
                reject(reason);
            });
    });
};
