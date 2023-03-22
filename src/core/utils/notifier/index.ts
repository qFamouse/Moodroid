import { NotificationType } from "~core/enums/notification-type";
import type { Notification } from "~core/types/notification";

import { appendStyles } from "./append-styles";
import type { Styles } from "./style-type";

const basicNotificationStyles = {
    position: "fixed",
    margin: "0 auto",
    width: "fit-content",
    left: "0",
    right: "0",
    top: "10%",
    padding: "5px 15px",
    borderRadius: "10px",
    fontSize: "1.2rem",
    textAlign: "center",
    visibility: "1",
    opacity: "1",
    transition: "opacity 0.2s ease"
} as const;

type AvailableStyles = Omit<Styles, keyof typeof basicNotificationStyles>;

//TODO: separate class for drawing notifications?
export class Notifier {
    static notificationStyles = new Map<NotificationType, AvailableStyles>([
        [NotificationType.info, { background: "blue" }],
        [NotificationType.warn, { background: "yellow" }],
        [NotificationType.error, { background: "red" }]
    ]);

    static showMessage(notification: Notification, delay: number = 1000, element: Element = document.body) {
        const { message, type, cause } = notification;
        const notifiactionElement = document.createElement("div");
        notifiactionElement.textContent = message;

        appendStyles(notifiactionElement, this.notificationStyles.get(type));
        appendStyles(notifiactionElement, basicNotificationStyles);
        element.appendChild(notifiactionElement);
        setTimeout(() => {
            notifiactionElement.style.visibility = "0";
            notifiactionElement.style.opacity = "0";
            notifiactionElement.remove();
        }, delay);
    }
}
