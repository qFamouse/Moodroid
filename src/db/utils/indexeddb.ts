import { QuestionImportMethod } from "~core/enums/question-import-method";
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
    openRequest.onerror = (reason) => {
      reject(reason);
    };
    openRequest.onupgradeneeded = (event: any) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, {keyPath: "key"});
      }
    }
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

/**
 * @param questions add question, if method is Added, AddedOrOverwritten or Merged 
 */
export async function chooseQuestionImportMethod(questionToImport: Question, questionKey: string, questions?: Document[]): Promise<QuestionImportMethod> {
  return new Promise((resolve) => {
    console.debug("chooseQuestionImportMethod()", questionToImport, questionKey);

    if (!questionToImport?.answer?.state) {
      let message: string = `No state in question with key "${questionKey}"`;
      console.debug(message);
      throw new Error(message);
    }

    switch (questionToImport.answer.state) {
      case QuestionState.correct:
        questions?.push({key: questionKey, question: questionToImport});
        resolve(QuestionImportMethod.AddOrOverwrite);
        return;
      case QuestionState.partiallycorrect:
        retrieveQuestion(questionKey).then((questionInDb) => {
          if (questionInDb) {
            if (questionInDb.type !== questionToImport.type) {
              let message: string = `Can't import question with key "${questionKey}": \
                types (${questionInDb.type}, ${questionToImport.type}) are not equal`;
              console.debug(message);
              throw new Error(message);
            }
    
            switch (questionInDb.answer.state) {
              case QuestionState.correct:
                resolve(QuestionImportMethod.Ignore);
                return;
              case QuestionState.incorrect:
                questions?.push({key: questionKey, question: questionToImport});
                resolve(QuestionImportMethod.Add);
                return;                
              case QuestionState.partiallycorrect:
                let type: QuestionType = questionToImport.type;
                let text: string = questionToImport.text;
                let merger: IAnswerMerger = AnswerMergerFactory.getAnswerMerger(type);

                if (!merger) {
                  let message: string = `Can't import question with key "${questionKey}": \
                    no answer merger found (${questionInDb.answer.state}, ${questionToImport.answer.state})`;
                  console.debug(message);
                  throw new Error(message);
                }
                
                let mergedAnswer: IAnswer = merger.merge(questionInDb.answer, questionToImport.answer);

                questions?.push({key: questionKey, question: new Question(text, type, mergedAnswer)});
                resolve(QuestionImportMethod.Merge);
                return;
              default:
                questions?.push({key: questionKey, question: questionToImport});
                resolve(QuestionImportMethod.AddOrOverwrite);
                return;
            }
          } else {
            questions?.push({key: questionKey, question: questionToImport});
            resolve(QuestionImportMethod.Add);
            return;
          }
        });
        break;
      default:
        questions?.push({key: questionKey, question: questionToImport});
        resolve(QuestionImportMethod.AddOrOverwrite);
        return;
    }
  });
}

export async function importQuestions(newQuestions: Map<string, Question>): Promise<QuestionsImportStatus> {
  let importMethods: Promise<QuestionImportMethod>[] = [];
  let questionsToSave: Document[] = [];
  
  newQuestions.forEach((questionToImport: Question, questionKey: string) => {
    importMethods.push(chooseQuestionImportMethod(questionToImport, questionKey, questionsToSave));
  });
  return new Promise((onImported) => {
    Promise.allSettled(importMethods).then((promiseResults) => {
      console.debug("Question Import Methods", promiseResults);
      
      saveQuestions(questionsToSave).then(() => {
        let status: QuestionsImportStatus = {added: 0, merged: 0, failed: 0, ignored: 0, addedOrOverwritten: 0};
        promiseResults.forEach((promiseResult) => {
          if (promiseResult.status === "fulfilled") {
            switch (promiseResult.value) {
              case QuestionImportMethod.Add:
                status.added++;
                break;
              case QuestionImportMethod.Merge:
                status.merged++;
                break;
              case QuestionImportMethod.Ignore:
                status.ignored++;
                break;
              case QuestionImportMethod.AddOrOverwrite:
                status.addedOrOverwritten++;
                break;
            }
          } else {
            status.failed++;
          }
        });
        onImported(status);
      });
    });
  });
}

export async function saveQuestion(questionKey: string, question: Question): Promise<void> {
  return new Promise((onSaved, reject) => {
    openDatabase()
    .then((db) => {            
      let tx = createReadWriteTransaction(db);
      tx.oncomplete = () => {
        onSaved();
      }
      tx.onerror = (reason) => {
        reject(reason);
      }

      let store: IDBObjectStore = tx.objectStore(storeName);
      store.put({key: questionKey, question: question});
    })
    .catch((reason) => {
      reject(reason);
    });
  });
};

export async function saveQuestions(questions: Document[]): Promise<void> {
  return new Promise((onSaved, reject) => {
    openDatabase()
    .then((db) => {            
      let tx = createReadWriteTransaction(db);
      tx.oncomplete = () => {
        onSaved();
      }
      tx.onerror = (reason) => {
        reject(reason);
      }

      let store: IDBObjectStore = tx.objectStore(storeName);
      questions.forEach(question => { console.debug("Question saved", question); store.put(question); });
    })
    .catch((reason) => {
      reject(reason);
    });
  });
};

export async function retrieveQuestion(questionKey: string): Promise<Question> {
  return new Promise((onRetrieved, reject) => {
    openDatabase()
    .then((db) => {            
      let question: Question;
      let tx = createReadonlyTransaction(db);
      tx.oncomplete = () => {
        onRetrieved(question);
      }
      tx.onerror = (reason) => {
        reject(reason);
      }

      let store: IDBObjectStore = tx.objectStore(storeName);
      let request: IDBRequest = store.get(questionKey);
      request.onsuccess = (event: any) => {
        question = event.target.result?.question;
      }      
    })
    .catch((reason) => {
      reject(reason);
    });
  });
};

export async function retrieveAllQuestions(): Promise<Map<string, Question>> {
  return new Promise((onRetrieved, reject) => {
    openDatabase()
    .then((db) => {            
      let questions: Map<string, Question> = new Map();
      let tx = createReadonlyTransaction(db);
      tx.oncomplete = () => {
        onRetrieved(questions);
      }
      tx.onerror = (reason) => {
        reject(reason);
      }

      let store = tx.objectStore(storeName);
      let request: IDBRequest = store.getAll();
      request.onsuccess = (event: any) => {
        let documents: Document[] = event.target.result;        
        documents.forEach(d => questions.set(d.key, d.question));
      }
    })
    .catch((reason) => {
      reject(reason);
    });
  });
};

export async function retrieveQuestionsCount(): Promise<number> {
  return new Promise((onRetrieved, reject) => {
    openDatabase()
    .then((db) => {    
      let count: number;        
      let tx = createReadonlyTransaction(db);
      tx.oncomplete = () => {        
        onRetrieved(count);
      }
      tx.onerror = (reason) => {
        reject(reason);
      }

      let store = tx.objectStore(storeName);
      let request: IDBRequest = store.count();
      request.onsuccess = (event: any) => {       
        count = event.target.result;
      }
    })
    .catch((reason) => {
      reject(reason);
    });
  });
};

export async function removeAllQuestions(): Promise<void> {  
  return new Promise((onRemoved, reject) => {
    openDatabase()
    .then((db) => {    
      let tx = createReadWriteTransaction(db);
      tx.oncomplete = () => {        
        onRemoved();
      }
      tx.onerror = (reason) => {
        reject(reason);
      }

      let store = tx.objectStore(storeName);
      store.clear();
    })
    .catch((reason) => {
      reject(reason);
    });
  });
};
