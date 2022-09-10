import styles from "./form.module.css";
import { useCallback, useState } from "react";
import { readDatabase } from "~utils/readDatabase";

export function Form() {
  const [isCheats, setIsCheats] = useState("");   
  const [isResponseCollection, setIsResponseCollection] = useState("");   

  
  const setIsCheatsHandler = useCallback((event) => {
    setIsCheats(event.target.checked);
  }, []);

  const setisResponseCollectionHandler = useCallback((event) => {
    setIsResponseCollection(event.target.checked);
  }, []);

  const readFileHandler = useCallback((event) => {
    console.log(event.target.files);
    readDatabase(event.target.files[0]);
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
    </div>
  )

}