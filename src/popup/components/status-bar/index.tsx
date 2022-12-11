import styles from "./status-bar.module.scss"

interface IStatusBarRequiredProps {}

interface IToggleButtonOptionalProps {
    text?: string
}

const defaultProps: IToggleButtonOptionalProps = {}

interface IStatusBarProps
    extends IStatusBarRequiredProps,
        IToggleButtonOptionalProps {}

const StatusBar = (props: IStatusBarProps) => {
    const { text } = props

    return <div className={styles.statusbar}>{text}</div>
}

StatusBar.defaultProps = defaultProps

export default StatusBar
