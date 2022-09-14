import styles from "./popup-body.module.css";
import { useState } from "react";
import ToggleButton from "~components/toggle-button";
import StatusBar from "~components/status-bar";
import {QuestionDatabase} from "~utils/QuestionDatabase";
import {download} from "~utils/download";



export function PopupBody() {
    const [isCheats, setIsCheats] = useState(true);
    const [status, setStatus] = useState("Hello :)");

    const loadDatabaseHandler = (event) : void => {
        let file = event.target.files[0] as File;
        if (file) {
            setStatus("Loading Database...");
            file.text().then(text => {
                QuestionDatabase.import(text);
            })
        }
        else {
            setStatus("Failed database upload");
        }
    }

    const downloadDatabaseHandler = (event) : void => {
        QuestionDatabase.export().then(database => {
            download(database, "database.json", "application/json")
        })

    }

  return (
    <div className={styles.popupBody}>
        <div className={styles.optionHolder}>
            <ToggleButton
                text={"Cheats"}
                checked={isCheats}
                onClick={(event) => setIsCheats(event.target.checked)}/>
        </div>
        <label className={styles.button}>
            <input hidden type="file" accept=".json" onInput={loadDatabaseHandler}/>
            Load
        </label>
        <label className={styles.button}>
            <input hidden type="button" onClick={downloadDatabaseHandler} />
            Export
        </label>

        <StatusBar text={status}/>
    </div>  
  )
}

export default PopupBody;
