import styles from './menu.module.scss';
import { useCallback, useState } from "react";
import ToggleButton from "~components/toggle-button";
import StatusBar from "~components/status-bar";
import SelectButton, { ISelectOption } from "~components/select-button";
import {QuestionDatabase} from "~utils/QuestionDatabase";
import {download} from "~utils/download";

function classNames(classes) {
  return Object.entries(classes)
    .filter(([key, value]) => value)
    .map(([key, value]) => key)
    .join(' ');
}

export function Menu() {
    const [dbSize, setDbSize] = useState(0);
    const [status, setStatus] = useState("Hello :)");

    const [isStoreQuestions, setStoreQuestions] = useState(true);
    const [isManualSaving, setManualSaving] = useState(false);

    const setStoreQuestionsHandler = useCallback((event) : void => {
      setStoreQuestions(event.target.checked);
    }, [isStoreQuestions])

    const setManualSavingHandler = useCallback((event) : void => {
      setManualSaving(event.target.checked);
    }, [isManualSaving])


    const selectOptions: ISelectOption[] = [
      {name: 'Adventure mode', value: 'adventure', ico: 'adventure'},
      {name: 'Stealth mode', value: 'stealth', ico: 'stealth'},
      {name: 'Hack mode', value: 'hack', ico: 'hack'},
      {name: 'Disable', value: 'disable', ico: 'disable'}
    ]


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
        
        <div className={[styles.menu__database, styles.database].join(' ')}>
          <div className={styles.database__hint}>
            Database  
          </div>
          
          <div className={styles.database__records}>
            {dbSize} <br></br> <span>Records</span>
          </div>

          <div className={styles.database__buttons}>
            <label className={styles.button}>
              <input hidden type="file" accept=".json" onInput={loadDatabaseHandler}/>
              Import 
              <div className={[styles.button__ico, styles.button__ico_import].join(' ')}></div>
            </label>
          
            <label className={styles.button}>
              <input hidden type="button" onClick={downloadDatabaseHandler} />
              Export
              <div className={[styles.button__ico, styles.button__ico_export].join(' ')}></div>
            </label>
          </div>
        </div>

        <div className={[styles.menu__options, styles.options].join(' ')}>
          <div className={styles.options__hint}>
            Options
          </div>    
          <div className={classNames({
              [styles.options__toggle]: true,
              [styles.options__toggle_inactive]: !isStoreQuestions
            })}>
            <ToggleButton text='Store questions:' checked={isStoreQuestions} onChange={setStoreQuestionsHandler}/>
          </div>    
          <div className={classNames({
              [styles.options__toggle]: true,
              [styles.options__toggle_inactive]: !isManualSaving
            })}>
            <ToggleButton text='Manual saving:' checked={isManualSaving} onChange={setManualSavingHandler}/>
          </div>    
          <div className={styles.options__select}>
            <SelectButton options={selectOptions}/>
          </div>    
        </div>
        
        <div className={styles.menu__statusbar}>
          <StatusBar text={status}/>
        </div>

        <label className={
            [styles.menu__hide, 
              styles.button, 
              styles.button_no_border_radius
            ].join(' ')}>
          <input hidden type="button"/>
          Hide
        </label>

    </div>  
  )
}

export default Menu;
