import type {PlasmoContentScript} from "plasmo"
import {QuestionDatabase} from "~db/question-database";
import {generateQuestionKey} from "~core/utils/generate-question-key";
import type {IAnswerer} from "~core/interfaces/answerer";
import {AnswerersFactory} from "~core/utils/answerers-factory";
import modsCfg from "~../assets/configs/mods.conf.json"
import {ExtensionMode} from "~core/enums/extension-mode";
import {AccessValidator} from "~core/utils/access-validator";

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/attempt.php*"]
}

window.addEventListener("load", async () => {
    await AccessValidator.validate();

    // TODO: for production set window.localStorage to chrome.storage.local
    // TODO: adding provider for extension mode
    let currentExtensionMode : ExtensionMode = window.localStorage[modsCfg.localStorageKey] || ExtensionMode.exam //modsCfg.defaultMode

    if (!(currentExtensionMode in ExtensionMode)) {
        console.log("Disabled mode", currentExtensionMode)
        return
    }

    let ques = document.querySelectorAll('.que') as NodeListOf<HTMLElement>;

    ques.forEach((que, i) => {
        let key: string = generateQuestionKey(que);

        QuestionDatabase.get(key).then(question => {
            if (!question) {
                console.log("Not found", key);
                return;
            }

            let answerer : IAnswerer = AnswerersFactory.getAnswerer(question.type);

            if (!answerer) {
                console.log("Answerer not found", question.type);
                return;
            }

            try {
                switch (currentExtensionMode) {
                    case ExtensionMode.exam: answerer.exam(que, question);
                        break;
                    case ExtensionMode.hack: answerer.hack(que, question);
                        break;
                    case ExtensionMode.adventure: answerer.adventure(que, question);
                        break;
                    default:
                        console.warn("Unsupported extension mode", i)
                }
            }
            catch (e) {
                console.warn(e, i);
            }
        })
    })
})


