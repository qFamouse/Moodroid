import { useId } from 'react';
import styles from './toggle.module.css';


export function ToggleButton({label, changeValue, value}) {

    const id = useId();
    const valueChangeHandler = (event) => changeValue(event);

    return (
    <div className={styles.toggle}>
      <label htmlFor={id} style={{flexBasis:0}} className={styles.noselect}>{label}:</label>
      <label className={styles.switch}>
        <input type="checkbox" id={id} onChange={valueChangeHandler} checked={value}/>
        <span className={styles.slider}></span>
      </label>
    </div>
    )
}