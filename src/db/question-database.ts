import { ResponseStatus } from "~core/enums/response-status";
import type { IResponse } from "~core/interfaces/response";
import type { Question } from "~core/models/question";
import type { QuestionsImportStatus } from "~core/types/questions-import-status";
import { AddRequest } from "~db/requests/add-request";
import { ClearRequest } from "~db/requests/clear-request";
import { ExportRequest } from "~db/requests/export-request";
import { GetRequest } from "~db/requests/get-request";
import { ImportRequest } from "~db/requests/import-request";
import { SizeRequest } from "~db/requests/size-request";
import type { SuccessResponseWithData } from "~db/responses/success-response-with-data";

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
            value: Array.from(value.entries()) // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

export class QuestionDatabase {

    private static handleResponseWithoutData(response: IResponse, resolve: () => void, reject: (value: any) => void, error: Error) {
        if (response.status !== ResponseStatus.Success) {
            reject(error);
        }
        resolve();
    }

    private static handleResponseWithData(response: IResponse, resolve: (value: any) => void, reject: (value: any) => void, error: Error) {
        if (response.status !== ResponseStatus.Success) {
            reject(error);
        }
        resolve((response as SuccessResponseWithData).data);
    }

    static async import(data: string): Promise<QuestionsImportStatus> {
        return new Promise((onReceived, onError) => {
            chrome.runtime.sendMessage(new ImportRequest(data), (response: IResponse) => {
                QuestionDatabase.handleResponseWithData(response, onReceived, onError, new Error("Failed to import questions."));
            });
        });
    }

    static async export(): Promise<string> {
        return new Promise((onExported, onError) => {
            chrome.runtime.sendMessage(new ExportRequest(), (response: IResponse) => {
                QuestionDatabase.handleResponseWithData(response, onExported, onError, new Error("Failed to export questions."));
            });
        });
    }

    static async add(key: string, question: Question): Promise<void> {
        return new Promise((onAdded, onError) => {
            chrome.runtime.sendMessage(new AddRequest(key, question), (response: IResponse) => {
                QuestionDatabase.handleResponseWithoutData(response, onAdded, onError, new Error("Failed to add question to database."));
            });
        });
    }

    static async get(key: string): Promise<Question> {
        return new Promise((onReceived, onError) => {
            chrome.runtime.sendMessage(new GetRequest(key), (response: IResponse) => {
                QuestionDatabase.handleResponseWithData(response, onReceived, onError, new Error("Failed to get question."));
            });
        });
    }

    static async size(): Promise<number> {
        return new Promise((onReceived, onError) => {
            chrome.runtime.sendMessage(new SizeRequest(), (response: IResponse) => {
                QuestionDatabase.handleResponseWithData(response, onReceived, onError, new Error("Failed to get database size."));
            });
        });
    }

    static async clear(): Promise<void> {
        return new Promise((onCleared, onError) => {
            chrome.runtime.sendMessage(new ClearRequest(), (response: IResponse) => {
                QuestionDatabase.handleResponseWithoutData(response, onCleared, onError, new Error("Failed to clear database."));
            });
        });
    }
}
