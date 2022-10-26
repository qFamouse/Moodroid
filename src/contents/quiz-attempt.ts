import type {PlasmoContentScript} from "plasmo"
import {QuestionDatabase} from "~db/question-database";
import {generateQuestionKey} from "~core/utils/generate-question-key";
import type {IAnswerer} from "~core/interfaces/answerer";
import {AnswerersFactory} from "~core/utils/answerers-factory";
import modsCfg from "~../assets/configs/mods.conf.json"
import {ExtensionMode} from "~core/enums/extension-mode";

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/attempt.php*"]
}

window.addEventListener("load", async () => {
    let currentExtensionMode : ExtensionMode = window.localStorage[modsCfg.localStorageKey] ?? ExtensionMode.exam

    if (currentExtensionMode === ExtensionMode.disable) {
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
                    case ExtensionMode.exam: answerer.toExam(que, question);
                        break;
                    case ExtensionMode.hack: answerer.toHack(que, question);
                        break;
                    case ExtensionMode.adventure: answerer.toAdventure(que, question);
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


