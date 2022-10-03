import type { Question } from "~core/models/question";
import { ResponseStatus } from "~core/enums/response-status";
import type { QuestionsImportStatus } from "~core/types/questions-import-status";
import type {SuccessResponseWithData} from "~db/responses/success-response-with-data";
import type { Response } from "~db/responses/response";
import {ImportRequest} from "~db/requests/import-request";
import {ExportRequest} from "~db/requests/export-request";
import {AddRequest} from "~db/requests/add-request";
import {GetRequest} from "~db/requests/get-request";
import {SizeRequest} from "~db/requests/size-request";
import {ClearRequest} from "~db/requests/clear-request";

export function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

export function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

export class QuestionDatabase {

  private static handleResponseWithData(response: Response, resolve: (value: any) => void, error: Error) {
    if (response.status === ResponseStatus.Success) {
      resolve((response as SuccessResponseWithData).data);
    } else {
      throw error;
    }
  }

  static async import(data: string): Promise<QuestionsImportStatus> {
    return new Promise((onRecieved) => {
      chrome.runtime.sendMessage(new ImportRequest(data), function(response: Response) {
        QuestionDatabase.handleResponseWithData(response, onRecieved, new Error("Failed to import questions."));
      });
    });
  }

  static export(): Promise<string> {
    return new Promise((onExported) => {
      chrome.runtime.sendMessage(new ExportRequest(), function(response: Response) {
        QuestionDatabase.handleResponseWithData(response, onExported, new Error("Failed to export questions."));
      });
    });
  }

  static add(key: string, question: Question) {
    chrome.runtime.sendMessage(new AddRequest(key, question), function(response: Response) {
      if (response.status !== ResponseStatus.Success) {
        throw new Error("Failed to add question to database.");
      }
    });
  }

  static async get(key: string): Promise<Question> {
    return new Promise((onRecieved) => {
      chrome.runtime.sendMessage(new GetRequest(key), function(response: Response) {
        QuestionDatabase.handleResponseWithData(response, onRecieved, new Error("Failed to get question."));
      });
    });
  }

  static async size(): Promise<number> {
    return new Promise((onRecieved) => {
      chrome.runtime.sendMessage(new SizeRequest(), function(response: Response) {
        QuestionDatabase.handleResponseWithData(response, onRecieved, new Error("Failed to get database size."));
      });
    });
  }

  static clear() {
    chrome.runtime.sendMessage(new ClearRequest(), function(response: Response) {
      if (response.status !== ResponseStatus.Success) {
        throw new Error("Failed to clear database.");
      }
    });
  }
}
