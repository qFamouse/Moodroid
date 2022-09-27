import { Command } from "~models/Command";
import { FailedResponse } from "~models/responses/FailedResponse";
import type { Question } from "~models/Question";
import { SuccessResponse } from "~models/responses/SuccessResponse";
import { replacer, reviver } from "./QuestionDatabase";
import { importQuestionsToLocalStorage, removeAllQuestionsFromLocalStorate, retrieveAllQuestionsFromLocalStorage, retrieveQuestionFromLocalStorage, retrieveQuestionsCountFromLocalStorage, saveQuestionToLocalStorage } from "./storage";
import { SuccessResponseWithData } from "~models/responses/SuccessResponseWithData";
import type { ImportRequest } from "~models/requests/ImportRequest";
import type { AddRequest } from "~models/requests/AddRequest";
import type { GetRequest } from "~models/requests/GetRequest";

/**
 * Handle request: {command: Command.Import, data: "..."}
 */
export const handleImport = function(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
  if (request.command === Command.Import) {  
    try {
      console.log("Import requested.");

      let newQuestions: Map<string, Question> = JSON.parse((request as ImportRequest).data, reviver);
      importQuestionsToLocalStorage(newQuestions).then(function(importStatus) {
        sendResponse(new SuccessResponseWithData(importStatus));
        console.log(`Imported ${newQuestions.size - importStatus.failed}`, importStatus);
      });
    } catch (err) {
      sendResponse(new FailedResponse(err));
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
      sendResponse(new SuccessResponseWithData(text));
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
    saveQuestionToLocalStorage((request as AddRequest).key, (request as AddRequest).question).then(function() {
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
    retrieveQuestionFromLocalStorage((request as GetRequest).key).then(function(question) {
      sendResponse(new SuccessResponseWithData(question));
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
      sendResponse(new SuccessResponseWithData(count));
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