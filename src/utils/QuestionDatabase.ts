import type { Question } from "~models/Question";
import { Status } from "~models/Status";
import {squeezeText} from "~utils/squeezeText";
import { ImportRequest } from "~models/ImportRequest";
import { ExportRequest } from "~models/ExportRequest";
import { AddRequest } from "~models/AddRequest";
import { GetRequest } from "~models/GetRequest";
import { SizeRequest } from "~models/SizeRequest";
import { ClearRequest } from "~models/ClearRequest";

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
  static generateKey(text : string, images : NodeListOf<HTMLImageElement>) : string {
    images.forEach(image => {
      text += (image as HTMLImageElement).src;
    });

    return squeezeText(text);
  }

  static import(data: string): void {
    chrome.runtime.sendMessage(new ImportRequest(data), function(response) {
      if (response.status !== Status.Success) {
        throw new Error("Failed to import data to database.");
      }
    });
  }

  static export(): Promise<string> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(new ExportRequest(), function(response) {
        if (response.status !== Status.Success) {
          throw new Error("Failed to export data from database.");
        }
        resolve(response.text);
      });
    });
  }

  static add(key: string, question: Question): void {
    chrome.runtime.sendMessage(new AddRequest(key, question), function(response) {
      if (response.status !== Status.Success) {
        throw new Error("Failed to add question to database.");
      }
    });
  }

  static get(key: string): Promise<Question> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(new GetRequest(key), function(response) {
        if (response.status != Status.Success) {
          throw new Error("Failed to get question from database.");
        }
        resolve(response.question);
      });
    });
  }

  static size(): Promise<number> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(new SizeRequest(), function(response) {
        if (response.status !== Status.Success) {
          throw new Error("Failed get database size.");
        }
        resolve(response.size);
      });
    });
  }

  static clear(): void {
    chrome.runtime.sendMessage(new ClearRequest(), function(response) {
      if (response.status !== Status.Success) {
        throw new Error("Failed to clear database.");
      }
    });
  }
}
