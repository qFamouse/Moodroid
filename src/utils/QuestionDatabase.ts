import type { Question } from "~models/Question";

export enum Status {
  Success = "success",
  Failed  = "failed",
}

export enum Command {
  Import = "import",
  Export = "export",
  Add    = "add",
  Get    = "get",
  Size   = "size",
  Clear  = "clear",
}

export function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  } else {
    return value;
  }
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

  static import(data: string): void {
    chrome.runtime.sendMessage({command: Command.Import, data: data}, function(response) {
      if (response.status !== Status.Success) {
        throw new Error("Failed to import data to database.");
      }
    });
  }

  static export(): Promise<Map<string, Question>> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({command: Command.Export}, function(response) {
        if (response.status !== Status.Success) {
          throw new Error("Failed to export data from database.");
        }
        resolve(JSON.parse(response.text, reviver));
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