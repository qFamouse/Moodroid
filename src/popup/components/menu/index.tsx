import { useCallback, useEffect, useState } from "react"

import { QuestionDatabase } from "~db/question-database"

import { download } from "~popup/utils/download"
import { classNames } from "~popup/utils/class-names"
import SelectButton, { ISelectOption } from "../select-button"
import StatusBar from "../status-bar"
import ToggleButton from "../toggle-button"
import styles from "./menu.module.scss"
import Tooltip from "../tooltip"
import { ExtensionApi } from "~core/utils/extension-api"
import { ExtensionMode } from "~core/enums/extension-mode"

async function getStoreQuestionsInitialValue(): Promise<boolean> {
    return ExtensionApi.getCollectAnswersState();
}

async function getManualSavingInitialValue(): Promise<boolean> {
    return ExtensionApi.getExplicitParsingState();
}

async function getCurrentMode(): Promise<ExtensionMode> {
    return ExtensionApi.getCurrentMode();
}

function getSelectedOptionByMode(mode: ExtensionMode | 'disabled') {
    return selectOptions.find(({value}) => value === mode)
}

const selectOptions: ISelectOption[] = [
        { name: "Adventure mode", value: ExtensionMode.adventure, ico: "adventure" },
        { name: "Exam mode", value: ExtensionMode.exam, ico: "exam" },
        { name: "Hack mode", value: ExtensionMode.hack, ico: "hack" },
        { name: "Disabled", value: "disabled", ico: "disabled" }
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

            if(option.value === 'disabled') {
                ExtensionApi.setCurrentMode(null);
                return
            }
            ExtensionApi.setCurrentMode(option.value);
        }, 
        [selectedOption]
    )
    // TODO: implement by using useEffect
    const loadDatabaseHandler = (event): void => {
        let file = event.target.files[0] as File
        if (file) {
            setStatus("Loading Database...")
            file.text().then((text) => {
                if (text) {
                    try {
                        QuestionDatabase.import(text)
                        setStatus("Database is loaded")
                    } catch (e) {
                        setStatus(e.message)
                    }
                }
            })
        } else {
            setStatus("Failed database upload")
        }
        updateDatabaseSize()
    }

    const downloadDatabaseHandler = (event): void => {
        QuestionDatabase.export().then((database) => {
            download(database, "database.json", "application/json")
        })
    }

    const clearDatabaseHandler = (event): void => {
        QuestionDatabase.clear()
        updateDatabaseSize()
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
