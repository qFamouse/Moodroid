import { useCallback, useEffect, useState } from "react";

import { ExtensionMode } from "~core/enums/extension-mode";
import { ExtensionApi } from "~core/utils/extension-api";
import { QuestionDatabase } from "~db/question-database";
import { classNames } from "~popup/utils/class-names";
import { download } from "~popup/utils/download";

import SelectButton, { ISelectOption } from "../select-button";
import StatusBar from "../status-bar";
import ToggleButton from "../toggle-button";
import Tooltip from "../tooltip";
import styles from "./menu.module.scss";





async function getStoreQuestionsInitialValue(): Promise<boolean> {
    return ExtensionApi.getCollectAnswersState();
}

async function getManualSavingInitialValue(): Promise<boolean> {
    return ExtensionApi.getExplicitParsingState();
}

async function getCurrentMode(): Promise<ExtensionMode> {
    return ExtensionApi.getCurrentMode();
}

function getSelectedOptionByMode(mode: ExtensionMode) {
    return selectOptions.find(({value}) => value === mode)
}

const selectOptions: ISelectOption[] = [
        { name: "Adventure mode", value: ExtensionMode.adventure, ico: "adventure" },
        { name: "Exam mode", value: ExtensionMode.exam, ico: "exam" },
        { name: "Hack mode", value: ExtensionMode.hack, ico: "hack" },
        { name: "Disabled", value:  ExtensionMode.disabled, ico: "disabled" }
    ]

export function Menu() {
    const [dbSize, setDbSize] = useState(0)
    const [status, setStatus] = useState("Hello :)")

    const [isStoreQuestions, setStoreQuestions] = useState(false)
    const [isManualSaving, setManualSaving] = useState(false)
    const [selectedOption, setSelectedOption] = useState(selectOptions[3])

    // useEffect to properly load async values
    useEffect(() => {
        getStoreQuestionsInitialValue().then(value => setStoreQuestions(value));
        getManualSavingInitialValue().then(value => setManualSaving(value));
        getCurrentMode().then(value => setSelectedOption(getSelectedOptionByMode(value)))
        updateDatabaseSize().then(size => setDbSize(size));
    }, [])

    const setStoreQuestionsHandler = useCallback(
        (event): void => {
            setStoreQuestions(event.target.checked)
            ExtensionApi.setCollectAnswersState(event.target.checked);
        },
        [isStoreQuestions]
    )
    
    const setManualSavingHandler = useCallback(
        (event): void => {
            setManualSaving(event.target.checked);
            ExtensionApi.setExplicitParsingState(event.target.checked);
        },
        [isManualSaving]
    )

    const onSelectHandler = useCallback(
        (option: ISelectOption): void => {
            
            setSelectedOption(getSelectedOptionByMode(option.value))

            ExtensionApi.setCurrentMode(option.value);
        }, 
        [selectedOption]
    )
    // TODO: implement by using useEffect
    const loadDatabaseHandler = (event): void => {
        let files = event.target.files as Array<File>;

        if (files.length > 0) {
            setStatus("Loading Database...");
            for (let i = 0; i < files.length; i++) {
                files[i].text().then(text => {
                    if (text) {
                        try {
                            if (i === files.length - 1) {
                                QuestionDatabase.import(text).then(() => {
                                    // TODO: temp solution
                                    updateDatabaseSize().then(size => {
                                        setDbSize(size);
                                        setStatus("Loaded!");
                                    });
                                });
                            }
                            else {
                                QuestionDatabase.import(text);
                            }
                        } catch (e) {
                            setStatus(e.message)
                        }
                    }
                });
            }
        }
    }

    const downloadDatabaseHandler = (event): void => {
        QuestionDatabase.export().then((database) => {
            let date = new Date();
            download(
                database,
                `database_${date.toISOString().slice(0, 10)}_${date.getHours()}h${date.getMinutes()}m.json`,
                "application/json"
            );
        });
    };

    const clearDatabaseHandler = (event): void => {
        QuestionDatabase.clear().then(() => {
            // TODO: temp solution
            updateDatabaseSize().then(size => setDbSize(size));
        });
    }

    const updateDatabaseSize = (): Promise<number> => {
        return QuestionDatabase.size();
    }

    return (
        <div className={styles.menu}>
            <div className={[styles.menu__database, styles.database].join(" ")}>
                <div className={styles.database__header}>Database</div>

                <div className={styles.database__records}>
                    {dbSize} <br></br> <span>Records</span>
                </div>

                <div className={styles.database__buttons}>
                    <label className={styles.button}>
                        <input
                            hidden
                            multiple={true}
                            type="file"
                            accept=".json"
                            onInput={loadDatabaseHandler}
                        />
                        Import
                        <div
                            className={[
                                styles.button__ico,
                                styles.button__ico_import
                            ].join(" ")}></div>
                    </label>

                    <label className={styles.button}>
                        <input
                            hidden
                            type="button"
                            onClick={downloadDatabaseHandler}
                        />
                        Export
                        <div
                            className={[
                                styles.button__ico,
                                styles.button__ico_export
                            ].join(" ")}></div>
                    </label>
                </div>

                <div className={styles.database__buttons_center}>
                    <label className={styles.button}>
                        <input
                            hidden
                            type="button"
                            onClick={clearDatabaseHandler}
                        />
                        Clear
                        <div
                            className={[
                                styles.button__ico,
                                styles.button__ico_clear
                            ].join(" ")}></div>
                    </label>
                </div>

            </div>

            <div className={[styles.menu__options, styles.options].join(" ")}>
                <div className={styles.options__header}>Options</div>
                <div
                    className={classNames({
                        [styles.options__toggle]: true,
                        [styles.options__toggle_inactive]: !isStoreQuestions
                    })}>

                    <Tooltip text="Enables/disables saving questions to database" delay={1000}>
                        <ToggleButton
                            text="Collect questions:"
                            checked={isStoreQuestions}
                            onChange={setStoreQuestionsHandler}
                        />
                    </Tooltip>
                </div>
                <div
                    className={classNames({
                        [styles.options__toggle]: true,
                        [styles.options__toggle_inactive]: !isManualSaving
                    })}>

                    <Tooltip text="Enables/disables manual save questions to database" delay={1000}>
                        <ToggleButton
                            text="Explicit parsing:"
                            checked={isManualSaving}
                            onChange={setManualSavingHandler}
                        />
                    </Tooltip>
                </div>
                <div className={styles.options__select}>
                    <SelectButton options={selectOptions} onSelect={onSelectHandler} selectedOption={selectedOption} />
                </div>
            </div>

            <div className={styles.menu__statusbar}>
                <StatusBar text={status} />
            </div>

            <label
                className={[
                    styles.menu__hide,
                    styles.button,
                    styles.button_no_border_radius
                ].join(" ")}>
                <input hidden type="button" />
                Hide
            </label>
        </div>
    )
}

export default Menu
