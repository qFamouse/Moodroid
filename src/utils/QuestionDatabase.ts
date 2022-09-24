import type { Question } from "~models/Question";
import { ResponseStatus } from "~models/statuses/ResponseStatus";
import {squeezeText} from "~utils/squeezeText";
import type { QuestionsImportStatus } from "~models/statuses/QuestionsImportStatus";
import type { SuccessResponseWithData } from "~models/responses/SuccessResponseWithData";
import type { Response } from "~models/responses/Response";
import { ImportRequest } from "~models/requests/ImportRequest";
import { ExportRequest } from "~models/requests/ExportRequest";
import { AddRequest } from "~models/requests/AddRequest";
import { GetRequest } from "~models/requests/GetRequest";
import { SizeRequest } from "~models/requests/SizeRequest";
import { ClearRequest } from "~models/requests/ClearRequest";

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

  static generateKey(text : string, images : NodeListOf<HTMLImageElement>) : string {
    images.forEach(image => {
      text += (image as HTMLImageElement).src;
    });

    return squeezeText(text);
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
