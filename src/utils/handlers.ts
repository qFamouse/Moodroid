import { Command } from "~models/Command";
import { FailedResponse } from "~models/FailedResponse";
import type { Question } from "~models/Question";
import { SuccessResponse } from "~models/SuccessResponse";
import { replacer, reviver } from "./QuestionDatabase";
import { importQuestion, QuestionImportResult, removeAllQuestionsFromLocalStorate, retrieveAllQuestionsFromLocalStorage, retrieveQuestionFromLocalStorage, retrieveQuestionsCountFromLocalStorage, saveQuestionToLocalStorage } from "./storage";

/**
 * Handle request: {command: Command.Import, data: "..."}
 */
export const handleImport = function(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
  if (request.command === Command.Import) {  
    try {
      console.log("Import requested.");

      let newQuestions: Map<string, Question> = JSON.parse(request.data, reviver);
      let importResults: Promise<QuestionImportResult>[] = [];
      let added: number = 0;
      let merged: number = 0;
      let failed: number = 0;

      console.log("Data", newQuestions);

      newQuestions.forEach(function (questionToImport: Question, questionKey: string) {
        importResults.push(importQuestion(questionToImport, questionKey));
      });
      Promise.allSettled(importResults).then((promiseResults) => {
        promiseResults.forEach(function(promiseResult) {
          if (promiseResult.status === "fulfilled") {
            switch (promiseResult.value) {
              case QuestionImportResult.ADDED:
                added++;
                break;
              case QuestionImportResult.MERGED:
                merged++;
                break;
            }
          } else {
            failed++;
          }
        });

        let response: any = new SuccessResponse();
        let status: any = {};
        response.added  = status.added  = added;
        response.merged = status.merged = merged;
        response.failed = status.failed = failed;
        sendResponse(response);
        console.log(`Imported ${newQuestions.size - failed}`, status);
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