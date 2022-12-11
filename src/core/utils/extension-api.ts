import {ExtensionMode} from "~core/enums/extension-mode";

const
    CURRENT_MODE_KEY = "current_mode",
    DEFAULT_MODE : ExtensionMode = ExtensionMode.exam,

    COLLECT_ANSWERS_KEY = "collect_answers",
    DEFAULT_COLLECT_ANSWERS : boolean = true,

    EXPLICIT_PARSING_KEY = "explicit_parsing",
    DEFAULT_EXPLICIT_PARSING : boolean = false;

export class ExtensionApi {
    public static async getCurrentMode() : Promise<ExtensionMode> {
        let storage : object = await chrome.storage.local.get([CURRENT_MODE_KEY]);
        let currentMode : ExtensionMode = storage[CURRENT_MODE_KEY];

        if (!(currentMode in ExtensionMode)) {
            await chrome.storage.local.set({[CURRENT_MODE_KEY]: DEFAULT_MODE});
            return DEFAULT_MODE;
        }

        return currentMode;
    }

    public static async setCurrentMode(mode : ExtensionMode) : Promise<void> {
        await chrome.storage.local.set({[CURRENT_MODE_KEY]: mode});
    }

    public static async getCollectAnswersState() : Promise<boolean> {
        let storage : object = await chrome.storage.local.get([COLLECT_ANSWERS_KEY]);
        let currentState : boolean = storage[COLLECT_ANSWERS_KEY];

        if (typeof currentState !== "boolean") {
            await chrome.storage.local.set({[COLLECT_ANSWERS_KEY]: DEFAULT_COLLECT_ANSWERS});
            return DEFAULT_COLLECT_ANSWERS;
        }

        return currentState;
    }

    public static async setCollectAnswersState(state : boolean) : Promise<void> {
        await chrome.storage.local.set({[COLLECT_ANSWERS_KEY]: state});
    }

    public static async getExplicitParsingState() : Promise<boolean> {
        let storage : object = await chrome.storage.local.get([EXPLICIT_PARSING_KEY]);
        let currentState : boolean = storage[EXPLICIT_PARSING_KEY];

        if (typeof currentState !== "boolean") {
            await chrome.storage.local.set({[EXPLICIT_PARSING_KEY]: DEFAULT_EXPLICIT_PARSING});
            return DEFAULT_EXPLICIT_PARSING;
        }

        return currentState;
    }

    public static async setExplicitParsingState(state : boolean) : Promise<void> {
        await chrome.storage.local.set({[EXPLICIT_PARSING_KEY]: state});
    }
}
