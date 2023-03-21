import type { NotificationType } from "~core/enums/notification-type";

export declare type Notification = {
    type: NotificationType;
    message: string;
    cause?: any;
};
