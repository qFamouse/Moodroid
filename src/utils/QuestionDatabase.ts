import type { Question } from "~models/Question";
import { Command } from "~models/Command";
import { Status } from "~models/Status";
import {squeezeText} from "~utils/squeezeText";

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
    chrome.runtime.sendMessage({command: Command.Import, data: data}, function(response) {
      if (response.status !== Status.Success) {
        throw new Error("Failed to import data to database.");
      }
    });
  }

  static export(): Promise<string> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({command: Command.Export}, function(response) {
        if (response.status !== Status.Success) {
          throw new Error("Failed to export data from database.");
        }
        resolve(response.text);
      });
    });
  }

  static add(key: string, question: Question): void {
    chrome.runtime.sendMessage({command: Command.Add, key: key, question: question}, function(response) {
      if (response.status !== Status.Success) {
        throw new Error("Failed to add question to database.");
      }
    });
  }

  static get(key: string): Promise<Question> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({command: Command.Get, key: key}, function(response) {
        if (response.status != Status.Success) {
          throw new Error("Failed to get question from database.");
        }
        resolve(response.question);
      });
    });
  }

  static size(): Promise<number> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({command: Command.Size}, function(response) {
        if (response.status !== Status.Success) {
          throw new Error("Failed get database size.");
        }
        resolve(response.size);
      });
    });
  }

  static clear(): void {
    chrome.runtime.sendMessage({command: Command.Clear}, function(response) {
      if (response.status !== Status.Success) {
        throw new Error("Failed to clear database.");
      }
    });
  }
}
