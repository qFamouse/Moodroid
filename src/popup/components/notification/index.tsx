import { ForwardedRef, forwardRef, useEffect, useLayoutEffect, useRef } from "react";

import type { NotificationType } from "~core/enums/notification-type";
import { classNames } from "~popup/utils/class-names";

import styles from "./notification.module.scss";

interface INotificationRequiredProps {
    message: string;
    type: NotificationType;
    ttl?: number;
}

interface INotificationOptionalProps {}

const defaultProps: INotificationOptionalProps = {};

interface INotificationProps extends INotificationRequiredProps, INotificationOptionalProps {}
//TODO: find better solution for unmount animation
const Notification = (props: INotificationProps) => {
    const { message, type, ttl = 3000 } = props;
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        setTimeout(() => {
            ref.current.style.opacity = "0";
            ref.current.style.visibility = "0";
            ref.current.style.transform = "translateX(100%)";
        }, Math.max(ttl - 500, 0));
    }, [ref.current]);

    return (
        <div
            ref={ref}
            className={classNames({
                [styles.notification]: true,
                [styles[`notification_${type}`]]: true
            })}>
            {message}
        </div>
    );
};

Notification.defaultProps = defaultProps;

export default Notification;
