import styles from "./menu.module.css";
import { useState } from "react";
import ToggleButton from "~components/toggle-button";
import StatusBar from "~components/status-bar";
import {QuestionDatabase} from "~utils/QuestionDatabase";
import {download} from "~utils/download";



export function Menu() {
    const [dbSize, setDbSize] = useState(0);
    const [status, setStatus] = useState("Hello :)");


    const loadDatabaseHandler = (event) : void => {
        let file = event.target.files[0] as File;
        if (file) {
            setStatus("Loading Database...");
            file.text().then(text => {
                if (text) {
                    try {
                        QuestionDatabase.import(text);
                        setStatus("Database is loaded")

                    }
                    catch (e) {
                        setStatus(e.message)
                    }
                }
            })
        }
        else {
            setStatus("Failed database upload");
        }
        updateDatabaseSize();
    }

    const downloadDatabaseHandler = (event) : void => {
        QuestionDatabase.export().then(database => {
            download(database, "database.json", "application/json")
        })

    }

    const clearDatabaseHandler = (event) : void => {
        QuestionDatabase.clear();
        updateDatabaseSize();
    }

    const updateDatabaseSize = () : void => {
        QuestionDatabase.size().then(size => {
            setDbSize(size);
        })
    }


    updateDatabaseSize();

    return (
    <div className={styles.menu}>
        <div className={styles.optionHolder}>
            <p>Database size: {dbSize}</p>
        </div>
        <label className={styles.button}>
            <input hidden type="file" accept=".json" onInput={loadDatabaseHandler}/>
            Load
        </label>
        <label className={styles.button}>
            <input hidden type="button" onClick={downloadDatabaseHandler} />
            Export
        </label>
        <label className={styles.button}>
            <input hidden type="button" onClick={clearDatabaseHandler}/>
            Clear
        </label>

        <StatusBar text={status}/>
    </div>  
  )
}

export default Menu;
