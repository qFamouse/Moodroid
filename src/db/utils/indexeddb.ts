import { QuestionImportStatus } from "~core/enums/question-import-status";
import { QuestionState } from "~core/enums/question-state";
import type { QuestionType } from "~core/enums/question-type";
import type { IAnswer } from "~core/interfaces/answer";
import type { IAnswerMerger } from "~core/interfaces/answer-merger";
import { Question } from "~core/models/question";
import type { QuestionsImportStatus } from "~core/types/questions-import-status";
import { AnswerMergerFactory } from "./import/answer-merger-factory";

declare type Document = {
  key: string,
  question: Question
};

class Cache {
  static database: IDBDatabase;
}

const databaseName: string = "QuestionsDB";
const storeName: string = "QuestionsStore";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((onOpened, reject) => {
    let db: IDBDatabase;

    if (db = Cache.database) {
      onOpened(db);
    }

    const openRequest: IDBOpenDBRequest = indexedDB.open(databaseName);
    openRequest.onerror = function(reason) {
      reject(reason);
    };
    openRequest.onupgradeneeded = function(event: any) {
      db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, {keyPath: "key"});
      }
    }
    openRequest.onsuccess = function(event: any) {
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

export async function predictQuestionImportStatus(questionToImport: Question, questionKey: string, questions?: Document[]): Promise<QuestionImportStatus> {
  return new Promise((resolve) => {
    switch (questionToImport.answer.state) {
      case QuestionState.correct:
        questions?.push({key: questionKey, question: questionToImport});
        resolve(QuestionImportStatus.Overwritten);
        break;
      case QuestionState.partiallycorrect:
        retrieveQuestion(questionKey).then(function(questionInDb) {
          if (questionInDb) {
            if (questionInDb.type !== questionToImport.type) {
              throw new Error(`Can't import question with key "${questionKey}": \
                types (${questionInDb.type}, ${questionToImport.type}) are not equal`);
            }
    
            switch (questionInDb.answer.state) {
              case QuestionState.correct:
                resolve(QuestionImportStatus.Ignored);
                break;
              case QuestionState.incorrect:
                questions?.push({key: questionKey, question: questionToImport});
                resolve(QuestionImportStatus.Added);
                break;
              case QuestionState.partiallycorrect:
                let type: QuestionType = questionToImport.type;
                let text: string = questionToImport.text;
                let merger: IAnswerMerger = AnswerMergerFactory.getAnswerMerger(type);

                if (!merger) {
                  throw new Error(`Can't import question with key "${questionKey}": \
                    no answer merger found (${questionInDb.answer.state}, ${questionToImport.answer.state})`);
                }
                
                let mergedAnswer: IAnswer = merger.merge(questionInDb.answer, questionToImport.answer);

                questions?.push({key: questionKey, question: new Question(text, type, mergedAnswer)});
                resolve(QuestionImportStatus.Merged);
                break;
              default:
                throw new Error(`Can't import question with key "${questionKey}": \
                  question states (${questionInDb.answer.state}, ${questionToImport.answer.state})`);
            }
          } else {
            questions?.push({key: questionKey, question: questionToImport});
            resolve(QuestionImportStatus.Added);
          }
        });
        break;
      default:
        resolve(QuestionImportStatus.Ignored);
    }
  });
}

export async function importQuestions(newQuestions: Map<string, Question>): Promise<QuestionsImportStatus> {
  let importStatuses: Promise<QuestionImportStatus>[] = [];
  let questionsToSave: Document[] = [];
  let status: QuestionsImportStatus = {added: 0, merged: 0, failed: 0, ignored: 0, overwritten: 0};

  newQuestions.forEach(function(questionToImport: Question, questionKey: string) {
    importStatuses.push(predictQuestionImportStatus(questionToImport, questionKey, questionsToSave));
  });
  return new Promise((onImported) => {
    Promise.allSettled(importStatuses).then((promiseResults) => {
      saveQuestions(questionsToSave).then(() => {
        promiseResults.forEach(function(promiseResult) {
          if (promiseResult.status === "fulfilled") {
            switch (promiseResult.value) {
              case QuestionImportStatus.Added:
                status.added++;
                break;
              case QuestionImportStatus.Merged:
                status.merged++;
                break;
              case QuestionImportStatus.Ignored:
                status.ignored++;
                break;
              case QuestionImportStatus.Overwritten:
                status.overwritten++;
                break;
            }
          } else {
            status.failed++;
          }
          onImported(status);
        });
      });
    });
  });
}

export async function saveQuestion(questionKey: string, question: Question): Promise<void> {
  return new Promise((onSaved, reject) => {
    openDatabase()
    .then(function(db) {            
      let tx = createReadWriteTransaction(db);
      tx.oncomplete = function() {
        onSaved();
      }
      tx.onerror = function(reason) {
        reject(reason);
      }

      let store: IDBObjectStore = tx.objectStore(storeName);
      store.put({key: questionKey, question: question});
    })
    .catch(function(reason) {
      reject(reason);
    });
  });
};

export async function saveQuestions(questions: Document[]): Promise<void> {
  return new Promise((onSaved, reject) => {
    openDatabase()
    .then(function(db) {            
      let tx = createReadWriteTransaction(db);
      tx.oncomplete = function() {
        onSaved();
      }
      tx.onerror = function(reason) {
        reject(reason);
      }

      let store: IDBObjectStore = tx.objectStore(storeName);
      questions.forEach(question => store.put(question));
    })
    .catch(function(reason) {
      reject(reason);
    });
  });
};

export async function retrieveQuestion(questionKey: string): Promise<Question> {
  return new Promise((onRetrieved, reject) => {
    openDatabase()
    .then(function(db) {            
      let question: Question;
      let tx = createReadonlyTransaction(db);
      tx.oncomplete = function() {
        onRetrieved(question);
      }
      tx.onerror = function(reason) {
        reject(reason);
      }

      let store: IDBObjectStore = tx.objectStore(storeName);
      let request: IDBRequest = store.get(questionKey);
      request.onsuccess = function(event: any) {
        question = event.target.result?.question;
      }      
    })
    .catch(function(reason) {
      reject(reason);
    });
  });
};

export async function retrieveAllQuestions(): Promise<Map<string, Question>> {
  return new Promise((onRetrieved, reject) => {
    openDatabase()
    .then(function(db) {            
      let questions: Map<string, Question> = new Map();
      let tx = createReadonlyTransaction(db);
      tx.oncomplete = function() {
        onRetrieved(questions);
      }
      tx.onerror = function(reason) {
        reject(reason);
      }

      let store = tx.objectStore(storeName);
      let request: IDBRequest = store.getAll();
      request.onsuccess = function(event: any) {
        let documents: Document[] = event.target.result;        
        documents.forEach(d => questions.set(d.key, d.question));
      }
    })
    .catch(function(reason) {
      reject(reason);
    });
  });
};

export async function retrieveQuestionsCount(): Promise<number> {
  return new Promise((onRetrieved, reject) => {
    openDatabase()
    .then(function(db) {    
      let count: number;        
      let tx = createReadonlyTransaction(db);
      tx.oncomplete = function() {        
        onRetrieved(count);
      }
      tx.onerror = function(reason) {
        reject(reason);
      }

      let store = tx.objectStore(storeName);
      let request: IDBRequest = store.count();
      request.onsuccess = function(event: any) {       
        count = event.target.result;
      }
    })
    .catch(function(reason) {
      reject(reason);
    });
  });
};

export async function removeAllQuestions(): Promise<void> {  
  return new Promise((onRemoved, reject) => {
    openDatabase()
    .then(function(db) {    
      let tx = createReadWriteTransaction(db);
      tx.oncomplete = function() {        
        onRemoved();
      }
      tx.onerror = function(reason) {
        reject(reason);
      }

      let store = tx.objectStore(storeName);
      store.clear();
    })
    .catch(function(reason) {
      reject(reason);
    });
  });
};
