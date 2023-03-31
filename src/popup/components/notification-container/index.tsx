import { useEffect, useLayoutEffect, useState } from "react";

import type { Notification } from "~core/types/notification";

import NotificationComponent from "../notification";
import styles from "./notification-container.module.scss";

interface INotificationContainerRequiredProps {
    notifications: Array<Notification & { ttl?: number; id?: number }>;
}

interface INotificationContainerOptionalProps {}

const defaultProps: INotificationContainerOptionalProps = {};

interface INotificationContainerProps extends INotificationContainerRequiredProps, INotificationContainerOptionalProps {}

const NotificationContainer = (props: INotificationContainerProps) => {
    const { notifications } = props;

    return (
        <div className={styles["notification-container"]}>
            {notifications.map((notification, index) => (
                <NotificationComponent key={notification.id} {...notification} />
            ))}
        </div>
    );
};

NotificationContainer.defaultProps = defaultProps;

export default NotificationContainer;
