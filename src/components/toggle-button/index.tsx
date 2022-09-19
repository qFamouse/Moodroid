import { useId } from 'react';
import styles from './toggle-button.module.css';


interface IToggleButtonRequiredProps {

}

interface IToggleButtonOptionalProps {
    text?: string;
    checked?: boolean;

    onChange?: any;
}

const defaultProps: IToggleButtonOptionalProps = {

}

interface IToggleButtonProps extends IToggleButtonRequiredProps, IToggleButtonOptionalProps {}

const ToggleButton = (props: IToggleButtonProps) => {
    const { text, checked, onChange } = props;
    const toggleId = useId();

    return (
    <div className={styles.toggle}>
        <label htmlFor={toggleId} className={styles.noselect}>{text}</label>
        <label className={styles.switch}>
            <input id={toggleId} type="checkbox" onChange={onChange} checked={checked}/>
            <span className={styles.slider}/>
        </label>
    </div>
    )
}

ToggleButton.defaultProps = defaultProps;

export default ToggleButton;
