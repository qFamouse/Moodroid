import styles from "./form.module.css";
import { useCallback, useState } from "react";
import { readDatabase, readDatabasePromise } from "~utils/readDatabase";
import { StatusBar } from "~components/statusbar";

export function Form() {
  const [isCheats, setIsCheats] = useState("");   
  const [isResponseCollection, setIsResponseCollection] = useState("");  
  const [statusMessage, setStatusMessage] = useState(""); 

  
  const setIsCheatsHandler = useCallback((event) => {
    setIsCheats(event.target.checked);
  }, []);

  const setisResponseCollectionHandler = useCallback((event) => {
    setIsResponseCollection(event.target.checked);
  }, []);

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

        <div className={styles.toggle}>
          <label htmlFor="cheatsOption">Cheats:</label>
          <label className={styles.switch}>
            <input type="checkbox" id="cheatsOption" onChange={setIsCheatsHandler}/>
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.toggle}>
          <label htmlFor="responsesOption" style={{flexBasis: 0}}>Collect Responses:</label>
          <label className={styles.switch}>
            <input type="checkbox" id="responsesOption" onChange={setisResponseCollectionHandler}/>
            <span className={styles.slider}></span>
          </label>
        </div>

      </div>

      <label className={styles.button}>
        Load Database
        <input id="fileUpload" type="file" hidden onChange={readFileHandler}/>
      </label>
      <input type="button" value="Export Database" className={styles.button}/>
      
      <StatusBar message={statusMessage || "Nothing happening"}/>
    </div>  
  )

}