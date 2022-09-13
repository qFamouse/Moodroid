import styles from "./form.module.css";
import { useCallback, useState } from "react";
import { readDatabase, readDatabasePromise } from "~utils/readDatabase";
import { StatusBar } from "~components/statusbar";
import { ToggleSwitch } from "~components/toggle";

export function Form() {
  const [isCheats, setIsCheats] = useState(false);   
  const [isResponseCollection, setIsResponseCollection] = useState(false);  
  const [statusMessage, setStatusMessage] = useState(""); 

  const setIsCheatsHandler = useCallback((event) => {
    setIsCheats(event.target.checked);
  }, [isCheats]);

  const setisResponseCollectionHandler = useCallback((event) => {
    setIsResponseCollection(event.target.checked);
  }, [isResponseCollection]);

  const setStatusMessageHandler = useCallback((text: string) => {
    setStatusMessage(text);
  }, []);

  const readFileHandler = useCallback(async (event) => {
    console.log(event.target.files);
    setStatusMessageHandler("Loading Database...");
    readDatabasePromise(event.target.files[0])
    .then(text => {
      setStatusMessageHandler("Database readed");
      console.log(text);
    })
    .catch(err => {
        setStatusMessageHandler("Cannot read database");
        console.log(err);
    });
  }, []);

  return (
    <div className={styles.form}>

      <div className={styles.optionHolder}>
        <ToggleSwitch label={'Cheats'} changeValue={setIsCheatsHandler}/>
        <ToggleSwitch label={'Collect Responses'} changeValue={setisResponseCollectionHandler}/>
      </div>

      <label className={styles.button}>
        Load Database
        <input id="fileUpload" type="file" hidden onChange={readFileHandler}/>
      </label>
      <label className={styles.button}>
        Export Database
        <input type="button" hidden/>
      </label>
      
      <StatusBar message={statusMessage || "Nothing happening"}/>
    </div>  
  )

}