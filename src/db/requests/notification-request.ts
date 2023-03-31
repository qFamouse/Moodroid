import { Command } from "~core/enums/command";
import type { IRequest } from "~core/interfaces/request";

export class NotificationRequest implements IRequest {
    readonly command: Command = Command.Notification;

    constructor(readonly data: chrome.notifications.NotificationOptions<true>) {}
}
