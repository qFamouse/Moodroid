import type { Question } from "~core/models/question";
import { QuestionImportStatus } from "~core/enums/question-import-status";
import type { QuestionsImportStatus } from "~core/types/questions-import-status";
import { reviver } from "../question-database";

const localStorageQuestionKeyPrefix: string = "QUESTION_KEY_";

export function generateLocalStorageQuestionKey(questionKey: string): string {
  return localStorageQuestionKeyPrefix + questionKey;
}

export async function importQuestionToLocalStorage(questionToImport: Question, questionKey: string): Promise<QuestionImportStatus> {
  return new Promise((onImported) => {
    retrieveQuestionFromLocalStorage(questionKey).then(function(questionInDb) {
      if (questionInDb) {
        if (questionInDb.type !== questionToImport.type) {
          throw new Error(`Can't import question with key "${questionKey}": \
            types (${questionInDb.type}, ${questionToImport.type}) are not equal`);
        }
    
        questionToImport.correctAnswers.forEach(function(answerToImport) {
          if (!questionInDb.correctAnswers.find(answerInDb => answerInDb === answerToImport)) {
            questionInDb.correctAnswers.push(answerToImport);
          }
        });
        questionToImport.incorrectAnswers.forEach(function(answerToImport) {
          if (!questionInDb.incorrectAnswers.find(answerInDb => answerInDb === answerToImport)) {
            questionInDb.incorrectAnswers.push(answerToImport);
          }
        });
  
        saveQuestionToLocalStorage(questionKey, questionInDb).then(function() {
          onImported(QuestionImportStatus.Merged);
        });
      } else {
        saveQuestionToLocalStorage(questionKey, questionToImport).then(function() {
          onImported(QuestionImportStatus.Added);
        });
      }
    });
  });
}

export async function importQuestionsToLocalStorage(newQuestions: Map<string, Question>): Promise<QuestionsImportStatus> {
  let importStatuses: Promise<QuestionImportStatus>[] = [];
  let status: QuestionsImportStatus = {added: 0, merged: 0, failed: 0};

  newQuestions.forEach(function(questionToImport: Question, questionKey: string) {
    importStatuses.push(importQuestionToLocalStorage(questionToImport, questionKey));
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

export async function saveQuestionToLocalStorage(questionKey: string, question: Question): Promise<void> {
  let localStorageKey = generateLocalStorageQuestionKey(questionKey);
  let value: any = {};
  value[localStorageKey] = question;
  return new Promise((onSaved) => {
    chrome.storage.local.set(value, function() {
      console.log("Question saved to local storage.", questionKey, question);
      onSaved();
    });
  });
}

export async function retrieveQuestionFromLocalStorage(questionKey: string): Promise<Question> {
  let localStorageKey: string = generateLocalStorageQuestionKey(questionKey);
  return new Promise((onRetrieved) => {
    chrome.storage.local.get([localStorageKey], function(result) {
      onRetrieved(result[localStorageKey]);
    });
  });
}

export async function retrieveAllLocalStorageQuestionKeys(): Promise<string[]> {
  return new Promise((onRetrieved) => {
    chrome.storage.local.get(null, function(localStorage) {
      let localStorageQuestionKeys: string[] = Object.keys(localStorage).filter(key => key.startsWith(localStorageQuestionKeyPrefix));
      onRetrieved(localStorageQuestionKeys);
    });
  })
}

export async function retrieveAllQuestionsFromLocalStorage(): Promise<Map<string, Question>> {
  return new Promise((onRetrieved) => {
    retrieveAllLocalStorageQuestionKeys().then(function(localStorageQuestionKeys) {
      chrome.storage.local.get(null, function(localStorage) {
        let questions: Map<string, Question> = new Map();

        localStorageQuestionKeys.forEach(function(localStorageQuestionKey) {
          let key: string = localStorageQuestionKey.substring(localStorageQuestionKeyPrefix.length);
          let question: Question = localStorage[localStorageQuestionKey];
          questions.set(key, question);
        });
  
        onRetrieved(questions);
      });
    });
  })
}

export async function retrieveQuestionsCountFromLocalStorage(): Promise<number> {
  return new Promise((onRetrieved) => {
    retrieveAllLocalStorageQuestionKeys().then(function(localStorageQuestionKeys) {
      let count: number = localStorageQuestionKeys.length;
      onRetrieved(count);
    });
  });
}

export async function removeAllQuestionsFromLocalStorate() {
  retrieveAllLocalStorageQuestionKeys().then(function(localStorageQuestionKeys) {
    chrome.storage.local.remove(localStorageQuestionKeys);
  });
}

export async function loadDatabaseAsset(path: string) {
  const databaseUrl: string = chrome.runtime.getURL(path);
  fetch(databaseUrl)
  .then((response) => response.text())
  .then((text) => {
    try {
      let questions: Map<string, Question> = JSON.parse(text, reviver);
      importQuestionsToLocalStorage(questions).then(function(importStatus) {
        console.log(`Imported ${questions.size - importStatus.failed}`, importStatus);
      });
    } catch (err) {
      console.error("Import failed.", err);
    }
  })
  .catch(() => {
    console.log("No database asset found.");
  });
}
