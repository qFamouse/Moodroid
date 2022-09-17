import type { Question } from "~models/Question";
import { replacer, reviver } from "~utils/QuestionDatabase";
import { Command } from "~models/Command";
import { Status } from "~models/Status";

export {}

let questions: Map<string, Question> = new Map();

function importQuestion(questionToImport: Question, key: string): void {
  let questionInDb = questions.get(key);

  if (questionInDb.type !== questionToImport.type) {
    throw new Error(`Can't import question with key "${key}": types are not equal`);
  }

  if (questionInDb) {
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
}

/**
 * Handle request: {command: Command.Import, data: "..."}
 */
const handleImport = function(request, sender, sendResponse) {
  if (request.command === Command.Import) {
    try {
      let newQuestions: Map<string, Question> = JSON.parse(request.data, reviver);
      newQuestions.forEach(importQuestion);
    } catch (err) {
      sendResponse({status: Status.Failed, error: err});
      console.error("Import failed.", err);
    }
    sendResponse({status: Status.Success});
    console.log("Imported successfully.", questions);
  }
}

/**
 * Handle request: {command: Command.Export}
 */
const handleExport = function(request, sender, sendResponse) {
  if (request.command === Command.Export) {
    let text = JSON.stringify(questions, replacer);
    sendResponse({status: Status.Success, text: text});
    console.log("Exported successfully.");
  }
}

/**
 * Handle request: {command: Command.Add, key: "...", question: "..."}
 */
const handleAdd = function(request, sender, sendResponse) {
  if (request.command === Command.Add) {
    questions.set(request.key, request.question);
    sendResponse({status: Status.Success});
    console.log("Question added.", request.question);
  }
}

/**
 * Handle request: {command: Command.Get, key: "..."}
 */
const handleGet = function(request, sender, sendResponse) {
  if (request.command === Command.Get) {
    let question = questions.get(request.key);
    sendResponse({status: Status.Success, question: question});
    console.log("Question sent.", question);
  }
}

/**
 * Handle request: {command: Command.Size}
 */
const handleSize = function(request, sender, sendResponse) {
  if (request.command === Command.Size) {
    sendResponse({status: Status.Success, size: questions.size});
  }
}

/**
 * Handle request: {command: Command.Clear}
 */
const handleClear = function(request, sender, sendResponse) {
  if (request.command === Command.Clear) {
    questions.clear();
    sendResponse({status: Status.Success});
  }
}

// add listeners
chrome.runtime.onMessage.addListener(handleImport);

chrome.runtime.onMessage.addListener(handleExport);

chrome.runtime.onMessage.addListener(handleAdd);

chrome.runtime.onMessage.addListener(handleGet);

chrome.runtime.onMessage.addListener(handleSize);

chrome.runtime.onMessage.addListener(handleClear);
