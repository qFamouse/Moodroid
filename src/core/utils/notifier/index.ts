import { NotificationType } from "~core/enums/notification-type";
import type { Notification } from "~core/types/notification";

import type { Styles } from "../../types/style-type";
import { appendStyles } from "../append-styles";

const fadeTime = 0.5;

const basicNotificationStyles = {
    position: "relative",
    padding: "5px 15px",
    borderRadius: "10px",
    fontSize: "1.2rem",
    width: "100%",
    textAlign: "center",
    visibility: "1",
    opacity: "1",
    color: "#fff",
    transition: `opacity ${fadeTime}s ease, transform ${fadeTime}s ease`
} as const;

const basicNotificationContainerStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    position: "fixed",
    right: "10%",
    top: "10%",
    width: "fit-content",
    margin: "0 auto"
};

type AvailableStyles = Omit<Styles, keyof typeof basicNotificationStyles>;

//TODO: separate class for drawing notifications?
export class Notifier {
    static notificationStyles = new Map<NotificationType, AvailableStyles>([
        [NotificationType.info, { background: "blue" }],
        [NotificationType.warn, { background: "yellow" }],
        [NotificationType.error, { background: "red" }]
    ]);

    static defaultDelay = 1000;
    static messageBlock: HTMLDivElement = document.createElement("div");

    static showNotification(notification: Notification, delay: number = this.defaultDelay, element: Element = document.body) {
        const { message, type } = notification;

        const notificationElement = this.createNotificationElement(message);
        appendStyles(notificationElement, this.notificationStyles.get(type));
        appendStyles(notificationElement, basicNotificationStyles);

        if (element.contains(this.messageBlock)) {
            this.messageBlock.appendChild(notificationElement);
            return this.deleteNotificationElement(notificationElement, delay);
        }

        appendStyles(this.messageBlock, basicNotificationContainerStyles);
        element.appendChild(this.messageBlock);
        this.messageBlock.appendChild(notificationElement);
        this.deleteNotificationElement(notificationElement, delay);
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
        // console.log(chrome, chrome.notifications);
        // return chrome.notifications.create("", {
        //     message,
        //     title,
        //     type: "basic",
        //     iconUrl: "icon512.png"
        // });
    }

    private static createNotificationElement(text: string) {
        const notificationElement = document.createElement("div");
        notificationElement.textContent = text;
        return notificationElement;
    }

    private static deleteNotificationElement(notificationElement: HTMLDivElement, delay: number) {
        setTimeout(() => {
            notificationElement.style.visibility = "0";
            notificationElement.style.opacity = "0";
            notificationElement.style.transform = "translateX(100%)";
            setTimeout(() => notificationElement.remove(), fadeTime * 1000);
        }, delay);
    }
}
