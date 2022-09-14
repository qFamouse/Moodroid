import styles from "./popup-body.module.css";
import { useCallback, useState } from "react";
import { readDatabase, readDatabasePromise } from "~utils/readDatabase";
import { StatusBar } from "~components/statusbar";
import ToggleButton from "~components/toggle-button";

export function PopupBody() {
  const [isCheats, setIsCheats] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const setStatusMessageHandler = useCallback((text: string) => {
    setStatusMessage(text);
  }, []);

  const readFileHandler = useCallback(async (event) => {
    console.log(event.target.files);
    setStatusMessageHandler("Loading Database...");
    try {
      let text = await readDatabasePromise(event.target.files[0])
      setStatusMessageHandler("Database readed");
      console.log(text);
    }
    catch(error) {
      setStatusMessageHandler("Cannot read database");
      console.log(error);
    }
  }, [statusMessage]);

  return (
    <div className={styles.popupBody}>

      <div className={styles.optionHolder}>
        <ToggleButton
            text={"Cheats"}
            checked={isCheats}
            onClick={(event) => setIsCheats(event.target.checked)}/>
      </div>

      <label className={styles.button}>
        Load Database
        <input id="fileUpload" type="file" hidden onInput={readFileHandler}/>
      </label>
      <label className={styles.button}>
        Export Database
        <input type="button" hidden/>
      </label>
      
      <StatusBar message={statusMessage || "Nothing happening"}/>
    </div>  
  )

}
