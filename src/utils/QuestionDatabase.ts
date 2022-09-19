import type { Question } from "~models/Question";
import { squeezeText } from "~utils/squeezeText";

export class QuestionDatabase {

  private static readonly localStorageKey = "database";

  private static questions: Map<string, Question> = new Map();

  private static reviver(key, value) {
    if (typeof value === "object" && value !== null) {
      if (value.dataType === "Map") {
        return new Map(value.value);
      }
    }
    return value;
  }
  
  private static replacer(key, value) {
    if (value instanceof Map) {
      return {
        dataType: "Map",
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }

  static generateKey(text : string, images : NodeListOf<HTMLImageElement>) : string {
    images.forEach(image => {
      text += (image as HTMLImageElement).src;
    });

    return squeezeText(text);
  }

  private static importQuestion(questionToImport: Question, key: string): void {
    let questionInDb = QuestionDatabase.questions.get(key);
  
    if (questionInDb) {
      if (questionInDb.type !== questionToImport.type) {
        throw new Error(`Can't import question with key "${key}": types are not equal`);
      }
  
      questionToImport.correctAnswers?.forEach(function(answerToImport) {
        if (!questionInDb.correctAnswers?.find(answerInDb => answerInDb === answerToImport)) {
          questionInDb.correctAnswers.push(answerToImport);
        }
      });
      questionToImport.incorrectAnswers?.forEach(function(answerToImport) {
        if (!questionInDb.incorrectAnswers?.find(answerInDb => answerInDb === answerToImport)) {
          questionInDb.incorrectAnswers.push(answerToImport);
        }
      });
    } else {
      QuestionDatabase.questions.set(key, questionToImport);
    }
  }

  static import(data: string): void {
    try {
      let newQuestions: Map<string, Question> = JSON.parse(data, QuestionDatabase.reviver);
      newQuestions.forEach(QuestionDatabase.importQuestion);
    } catch (err) {
      console.error("Import failed.", err);
    }
    console.log("Imported successfully.", QuestionDatabase.questions);
    QuestionDatabase.saveQuestionsToLocalStorage();
  }

  static export(): Promise<string> {
    return new Promise((resolve) => {
      let text: string = JSON.stringify(QuestionDatabase.questions, QuestionDatabase.replacer);
      console.log("Exported successfully.");
      resolve(text);
    });
  }

  static add(key: string, question: Question): void {
    QuestionDatabase.questions.set(key, question);
    console.log("Question added.", question);
    QuestionDatabase.saveQuestionsToLocalStorage();
  }

  static get(key: string): Promise<Question> {
    return new Promise((resolve) => {
      let question: Question = QuestionDatabase.questions.get(key);
      resolve(question);
    });
  }

  // static size(): Promise<number> {
  //   return new Promise((resolve) => {
  //     let size: number = QuestionDatabase.questions.size;
  //     resolve(size);
  //   });
  // }

  static size(): number {
    return QuestionDatabase.questions.size;
  }

  static clear(): void {
    QuestionDatabase.questions.clear();
    QuestionDatabase.saveQuestionsToLocalStorage();
  }

  private static saveQuestionsToLocalStorage() {
    let value: any = {};
    value[QuestionDatabase.localStorageKey] = JSON.stringify(QuestionDatabase.questions, QuestionDatabase.replacer);
    chrome.storage.local.set(value, function() {
      console.log("Saved to local storage.");
    });
  }

  static {
    chrome.storage.local.get([QuestionDatabase.localStorageKey], function(result) {
      let savedQuestions = result[QuestionDatabase.localStorageKey];
      if (savedQuestions) {
        savedQuestions = JSON.parse(savedQuestions, QuestionDatabase.reviver);
        console.log("Local storage", savedQuestions);
        QuestionDatabase.questions = savedQuestions;
      } else {
        console.log("No data saved in local storage.");
      }
    });
  }
}
