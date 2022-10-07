import { QuestionImportStatus } from "~core/enums/question-import-status";
import type { Question } from "~core/models/question";
import type { QuestionsImportStatus } from "~core/types/questions-import-status";

declare type Document = {
  key: string,
  question: Question
};

const databaseName: string = "QuestionsDB";
const storeName: string = "QuestionsStore";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((onOpened, reject) => {
    let db: IDBDatabase;
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

export async function importQuestion(questionToImport: Question, questionKey: string): Promise<QuestionImportStatus> {
  return new Promise((onImported) => {
    retrieveQuestion(questionKey).then(function(questionInDb) {
      if (questionInDb) {
        if (questionInDb.type !== questionToImport.type) {
          throw new Error(`Can't import question with key "${questionKey}": \
            types (${questionInDb.type}, ${questionToImport.type}) are not equal`);
        }

        // TODO: implement import
  
        saveQuestion(questionKey, questionInDb).then(function() {
          onImported(QuestionImportStatus.Merged);
        });
      } else {
        saveQuestion(questionKey, questionToImport).then(function() {
          onImported(QuestionImportStatus.Added);
        });
      }
    });
  });
}

export async function importQuestions(newQuestions: Map<string, Question>): Promise<QuestionsImportStatus> {
  let importStatuses: Promise<QuestionImportStatus>[] = [];
  let status: QuestionsImportStatus = {added: 0, merged: 0, failed: 0};

  newQuestions.forEach(function(questionToImport: Question, questionKey: string) {
    importStatuses.push(importQuestion(questionToImport, questionKey));
  });
  return new Promise((onImported) => {
    Promise.allSettled(importStatuses).then((promiseResults) => {
      promiseResults.forEach(function(promiseResult) {
        if (promiseResult.status === "fulfilled") {
          switch (promiseResult.value) {
            case QuestionImportStatus.Added:
              status.added++;
              break;
            case QuestionImportStatus.Merged:
              status.merged++;
              break;
          }
        } else {
          status.failed++;
        }
      });
      onImported(status);
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
        question = event.target.result;
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
