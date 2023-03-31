import { Command } from "~core/enums/command";
import type { Question } from "~core/models/question";
import type { AddRequest } from "~db/requests/add-request";
import type { GetRequest } from "~db/requests/get-request";
import type { ImportRequest } from "~db/requests/import-request";
import type { NotificationRequest } from "~db/requests/notification-request";
import { FailedResponse } from "~db/responses/failed-response";
import { SuccessResponse } from "~db/responses/success-response";
import { SuccessResponseWithData } from "~db/responses/success-response-with-data";

import { replacer, reviver } from "../question-database";
import {
    importQuestions,
    removeAllQuestions,
    retrieveAllQuestions,
    retrieveQuestion,
    retrieveQuestionsCount,
    saveQuestion
} from "./indexeddb";

/**
 * Handle request: {command: Command.Import, data: "..."}
 */
export function handleImport(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    if (request.command === Command.Import) {
        try {
            console.log("Import requested.");

            let newQuestions: Map<string, Question> = JSON.parse((request as ImportRequest).data, reviver);
            importQuestions(newQuestions).then((importStatus) => {
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
export function handleExport(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    if (request.command === Command.Export) {
        retrieveAllQuestions().then((questions) => {
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
export function handleAdd(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    if (request.command === Command.Add) {
        saveQuestion((request as AddRequest).key, (request as AddRequest).question).then(() => {
            sendResponse(new SuccessResponse());
            console.log("Question added.", request.question);
        });
        return true;
    }
}

/**
 * Handle request: {command: Command.Get, key: "..."}
 */
export function handleGet(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    if (request.command === Command.Get) {
        retrieveQuestion((request as GetRequest).key).then((question) => {
            sendResponse(new SuccessResponseWithData(question));
            console.log("Question sent.", question);
        });
        return true;
    }
}

/**
 * Handle request: {command: Command.Size}
 */
export function handleSize(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    if (request.command === Command.Size) {
        retrieveQuestionsCount().then((count) => {
            sendResponse(new SuccessResponseWithData(count));
        });
        return true;
    }
}

/**
 * Handle request: {command: Command.Clear}
 */
export function handleClear(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    if (request.command === Command.Clear) {
        removeAllQuestions().then(() => {
            sendResponse(new SuccessResponse());
        });
        return true;
    }
}
/**
 * Handle request: {command: Command.Notification, data: chrome.runtime.NotificationOptions}
 */
export function handleNotification(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    if (request.command === Command.Notification) {
        const notificationOptions = (request as NotificationRequest).data;
        chrome.notifications.create("", notificationOptions, () => sendResponse(new SuccessResponse()));

        return true;
    }
}
