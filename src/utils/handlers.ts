import { Command } from "~models/Command";
import { FailedResponse } from "~models/FailedResponse";
import type { Question } from "~models/Question";
import { SuccessResponse } from "~models/SuccessResponse";
import { replacer, reviver } from "./QuestionDatabase";
import { importQuestionsToLocalStorage, removeAllQuestionsFromLocalStorate, retrieveAllQuestionsFromLocalStorage, retrieveQuestionFromLocalStorage, retrieveQuestionsCountFromLocalStorage, saveQuestionToLocalStorage } from "./storage";

/**
 * Handle request: {command: Command.Import, data: "..."}
 */
export const handleImport = function(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
  if (request.command === Command.Import) {  
    try {
      console.log("Import requested.");

      let newQuestions: Map<string, Question> = JSON.parse(request.data, reviver);
      importQuestionsToLocalStorage(newQuestions).then(function(importStatus) {
        let response: any = new SuccessResponse();
        response.importStatus = importStatus;
        sendResponse(response);
        console.log(`Imported ${newQuestions.size - importStatus.failed}`, importStatus);
      });
    } catch (err) {
      let response: any = new FailedResponse();
      response.error = err;
      sendResponse(response);
      console.error("Import failed.", err);
    }
    return true;
  }
}

/**
 * Handle request: {command: Command.Export}
 */
export const handleExport = function(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
  if (request.command === Command.Export) {
    retrieveAllQuestionsFromLocalStorage().then((questions) => {
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
export const handleAdd = function(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
  if (request.command === Command.Add) {
    saveQuestionToLocalStorage(request.key, request.question).then(function() {
      sendResponse(new SuccessResponse());
      console.log("Question added.", request.question);
    });
    return true;
  }
}

/**
 * Handle request: {command: Command.Get, key: "..."}
 */
export const handleGet = function(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
  if (request.command === Command.Get) {
    retrieveQuestionFromLocalStorage(request.key).then(function(question: Question) {
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
export const handleSize = function(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
  if (request.command === Command.Size) {
    retrieveQuestionsCountFromLocalStorage().then(function(count) {
      let response: any = new SuccessResponse();
      response.size = count;
      sendResponse(response);
    });
    return true;
  }
}

/**
 * Handle request: {command: Command.Clear}
 */
export const handleClear = function(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
  if (request.command === Command.Clear) {
    removeAllQuestionsFromLocalStorate().then(function() {
      sendResponse(new SuccessResponse());
    });
    return true;
  }
}