import styles from "./popup-body.module.css";
import { useState } from "react";
import ToggleButton from "~components/toggle-button";
import StatusBar from "~components/status-bar";

export function PopupBody() {
  const [isCheats, setIsCheats] = useState(true);
  const [status, setStatus] = useState("Hello :)");

  return (
    <div className={styles.popupBody}>
        <div className={styles.optionHolder}>
            <ToggleButton
                text={"Cheats"}
                checked={isCheats}
                onClick={(event) => setIsCheats(event.target.checked)}/>
        </div>
        <label className={styles.button}>
            <input hidden type="file" />
            Load</label>
        <label className={styles.button}>
            <input hidden type="button" />
            Export
        </label>

        <StatusBar text={status}/>
    </div>  
  )

}
