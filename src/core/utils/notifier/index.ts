import moodroidLogoImage from "data-base64:~assets/icon512.png";
import React from "react";
import ReactDOM from "react-dom/client";

import { NotificationType } from "~core/enums/notification-type";
import type { Notification } from "~core/types/notification";
import { NotificationRequest } from "~db/requests/notification-request";
import NotificationContainer from "~popup/components/notification-container";

export class Notifier {
    static defaultDelay = 3000;
    static messageBlock: HTMLDivElement = document.createElement("div");
    private static root: ReactDOM.Root;
    private static notifications: Array<Notification & { ttl?: number; id?: number }> = [];
    private static id = 0;

    static showNotification(notification: Notification, delay: number = this.defaultDelay, element: Element = document.body) {
        if (!element.contains(this.messageBlock)) {
            element.appendChild(this.messageBlock);
        }
        if (!this.root) {
            this.root = ReactDOM.createRoot(this.messageBlock);
        }
        const withIdNotification: typeof this.notifications[number] = { ...notification, id: this.id++, ttl: delay };

        this.notifications.push(withIdNotification);
        this.renderNotifications();
        this.deleteNotificationElement(withIdNotification, delay);
    }

    static showError(message: string, delay: number = this.defaultDelay, element: Element = document.body) {
        this.showNotification({ type: NotificationType.error, message }, delay, element);
    }

    static showWarn(message: string, delay: number = this.defaultDelay, element: Element = document.body) {
        this.showNotification({ type: NotificationType.warn, message }, delay, element);
    }

    static showInfo(message: string, delay: number = this.defaultDelay, element: Element = document.body) {
        this.showNotification({ type: NotificationType.info, message }, delay, element);
    }

    static showBrowserNotification(message: string, title: string = "Moodroid") {
        const options: chrome.notifications.NotificationOptions<true> = {
            message,
            title,
            type: "basic",
            iconUrl: moodroidLogoImage
        };

        chrome.runtime.sendMessage(new NotificationRequest(options));
    }

    static showUrgent(message: string, data: { title?: string; type: NotificationType; delay?: number; element?: Element }) {
        const { title, type, delay, element } = data;

        if (document.visibilityState === "hidden") {
            this.showBrowserNotification(message, title);
        } else {
            this.showNotification({ message, type }, delay, element);
        }
    }

    private static renderNotifications() {
        this.root.render(
            React.createElement(NotificationContainer, {
                notifications: this.notifications
            })
        );
    }

    private static deleteNotificationElement(notification: typeof this.notifications[number], delay: number) {
        setTimeout(() => {
            this.notifications.splice(this.notifications.indexOf(notification), 1);
            this.renderNotifications();
        }, delay);
    }
}
