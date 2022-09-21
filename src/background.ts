import type { Question } from "~models/Question";
import { replacer, reviver } from "~utils/QuestionDatabase";
import { Command } from "~models/Command";
import { FailedResponse } from "~models/FailedResponse";
import { SuccessResponse } from "~models/SuccessResponse";

export {}

const localStorageKey = "database";
let questions: Map<string, Question> = undefined;

/**
 * @returns empty object
 */
function loadQuestionsFromLocalStorageIfUndefined(): Promise<object> {
  return new Promise((resolve) => {
    if (!questions) {
      chrome.storage.local.get([localStorageKey], function(result) {
        let questionsSerialized: string = result[localStorageKey];
        if (questionsSerialized) {
          try {
            questions = JSON.parse(questionsSerialized, reviver) || new Map();
            console.log("Local storage", questions);
          } catch (err) {
            questions = new Map();
            console.error("Failed to get data from local storage.", err);
          }
        } else {
          questions = new Map();
          console.log("No data saved in local storage.");
        }
        resolve({});
      });
    } else {
      resolve({});
    }
  });
}

function saveQuestionsToLocalStorage() {
  let value: any = {};
  value[localStorageKey] = JSON.stringify(questions, replacer);
  chrome.storage.local.set(value, function() {
    console.log("Saved to local storage.");
  });
}

function importQuestion(questionToImport: Question, key: string): void {
  let questionInDb = questions.get(key);

  if (questionInDb) {
    if (questionInDb.type !== questionToImport.type) {
      throw new Error(`Can't import question with key "${key}": types are not equal`);
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
  } else {
    questions.set(key, questionToImport);
  }
};

/**
 * Handle request: {command: Command.Import, data: "..."}
 */
const handleImport = function(request, sender, sendResponse) {
  if (request.command === Command.Import) {  
    loadQuestionsFromLocalStorageIfUndefined().then(function() {
      try {
        let newQuestions: Map<string, Question> = JSON.parse(request.data, reviver);
        newQuestions.forEach(importQuestion);
      } catch (err) {
        let response: any = new FailedResponse();
        response.error = err;
        sendResponse(response);
        console.error("Import failed.", err);
      }
      sendResponse(new SuccessResponse());
      console.log("Imported successfully.", questions);
      saveQuestionsToLocalStorage();
    });
    return true;
  }
}

/**
 * Handle request: {command: Command.Export}
 */
const handleExport = function(request, sender, sendResponse) {
  if (request.command === Command.Export) {
    loadQuestionsFromLocalStorageIfUndefined().then(function() {
      let text = JSON.stringify(questions, replacer);
      let response: any = new SuccessResponse();
      response.text = text;
      sendResponse(response);
      console.log("Exported successfully.");
    });
    return true;
  }
}

/**
 * Handle request: {command: Command.Add, key: "...", question: "..."}
 */
const handleAdd = function(request, sender, sendResponse) {
  if (request.command === Command.Add) {
    loadQuestionsFromLocalStorageIfUndefined().then(function() {
      questions.set(request.key, request.question);
      sendResponse(new SuccessResponse());
      console.log("Question added.", request.question);
      saveQuestionsToLocalStorage();
    });
    return true;
  }
}

/**
 * Handle request: {command: Command.Get, key: "..."}
 */
const handleGet = function(request, sender, sendResponse) {
  if (request.command === Command.Get) {
    loadQuestionsFromLocalStorageIfUndefined().then(function() {
      let question = questions.get(request.key);
      let response: any = new SuccessResponse();
      response.question = question;
      sendResponse(response);
      console.log("Question sent.", question);
    });
    return true;
  }
}

/**
 * Handle request: {command: Command.Size}
 */
const handleSize = function(request, sender, sendResponse) {
  if (request.command === Command.Size) {
    loadQuestionsFromLocalStorageIfUndefined().then(function() {
      let response: any = new SuccessResponse();
      response.size = questions.size;
      sendResponse(response);
    });
    return true;
  }
}

/**
 * Handle request: {command: Command.Clear}
 */
const handleClear = function(request, sender, sendResponse) {
  if (request.command === Command.Clear) {
    loadQuestionsFromLocalStorageIfUndefined().then(function() {
      questions.clear();
      sendResponse(new SuccessResponse());
      saveQuestionsToLocalStorage();
    });
    return true;
  }
}

chrome.runtime.onMessage.addListener(handleImport);

chrome.runtime.onMessage.addListener(handleExport);

chrome.runtime.onMessage.addListener(handleAdd);

chrome.runtime.onMessage.addListener(handleGet);

chrome.runtime.onMessage.addListener(handleSize);

chrome.runtime.onMessage.addListener(handleClear);
