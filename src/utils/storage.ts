import type { Question } from "~models/Question";

export enum QuestionImportResult {
  ADDED  = "added",
  MERGED = "merged",
}

export const localStorageQuestionKeyPrefix: string = "QUESTION_KEY_";

export function generateLocalStorageQuestionKey(questionKey: string): string {
  return localStorageQuestionKeyPrefix + questionKey;
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
    chrome.storage.local.get(null, function(localStorage: any) {
      let localStorageQuestionKeys: string[] = Object.keys(localStorage).filter(key => key.startsWith(localStorageQuestionKeyPrefix));
      onRetrieved(localStorageQuestionKeys);
    });
  })
}

export async function retrieveAllQuestionsFromLocalStorage(): Promise<Map<string, Question>> {
  return new Promise((onRetrieved) => {
    retrieveAllLocalStorageQuestionKeys().then(function(localStorageQuestionKeys) {
      chrome.storage.local.get(null, function(localStorage: any) {
        let questions: Map<string, Question> = new Map();

        for (let localStorageQuestionKey of localStorageQuestionKeys) {
          let key: string = localStorageQuestionKey.substring(localStorageQuestionKey.length);
          let question: Question = localStorage[localStorageQuestionKey];
          questions.set(key, question);
        }
  
        onRetrieved(questions);
      });
    });
  })
}

export async function retrieveQuestionsCountFromLocalStorage(): Promise<number> {
  return new Promise((onRetrieved) => {
    chrome.storage.local.get(null, function(result) {
      retrieveAllLocalStorageQuestionKeys().then(function(localStorageQuestionKeys) {
        let count: number = localStorageQuestionKeys.length;
        onRetrieved(count);
      });
    });
  });
}

export async function importQuestion(questionToImport: Question, questionKey: string): Promise<QuestionImportResult> {
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
          onImported(QuestionImportResult.MERGED);
        });
      } else {
        saveQuestionToLocalStorage(questionKey, questionToImport).then(function() {
          onImported(QuestionImportResult.ADDED);
        });
      }
    });
  });
}

export async function removeAllQuestionsFromLocalStorate() {
  retrieveAllLocalStorageQuestionKeys().then(function(localStorageQuestionKeys) {
    chrome.storage.local.remove(localStorageQuestionKeys);
  });
}