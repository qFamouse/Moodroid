import type { NotificationType } from "~core/enums/notification-type";

export declare type Notification = {
    message: string;
    type: NotificationType;
    cause?: any;
};
