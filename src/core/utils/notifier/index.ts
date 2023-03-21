import { NotificationType } from "~core/enums/notification-type";
import type { Notification } from "~core/types/notification";

import { appendStyles } from "./append-styles";
import type { Styles } from "./style-type";

const basicNotificationStyles: Styles = {
    position: "absolute",
    margin: "0 auto",
    top: "25px",
    padding: "15px",
    fontSize: "1.2rem",
    textAlign: "center",
    visibility: "1",
    opacity: "1",
    transition: "opacity 0.2s ease"
};

export class Notifier {
    static notificationStyles = new Map<NotificationType, Styles>([
        [NotificationType.info, { fontSize: "2rem", background: "blue" }],
        [NotificationType.warn, { fontSize: "2rem", background: "yellow" }],
        [NotificationType.error, { fontSize: "2rem", background: "red" }]
    ]);

    static showMessage(notification: Notification, element: Element = document.body, delay: number = 1000) {
        const { message, type, cause } = notification;
        const errorElement = document.createElement("div");
        appendStyles(errorElement, this.notificationStyles.get(type));
        appendStyles(errorElement, basicNotificationStyles);
        element.appendChild(errorElement);
        setTimeout(() => {
            errorElement.style.visibility = "0";
            errorElement.style.opacity = "0";
            errorElement.remove();
        }, delay);
    }
}
