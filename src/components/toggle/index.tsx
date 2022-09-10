import { useCallback } from 'react';
import styles from './toggle.module.css';


export function ToggleSwitch({label, changeValue}) {

    const valueChangeHandler = (event) => changeValue(event);

    return (
    <div className={styles.toggle}>
      <label htmlFor="cheatsOption" style={{flexBasis:0}}>{label}:</label>
      <label className={styles.switch}>
        <input type="checkbox" id="cheatsOption" onChange={valueChangeHandler}/>
        <span className={styles.slider}></span>
      </label>
    </div>
    )
}