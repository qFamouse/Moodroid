import type { PlasmoContentScript } from "plasmo"

import { ExtensionMode } from "~core/enums/extension-mode"
import type { IAnswerer } from "~core/interfaces/answerer"
import { AccessValidator } from "~core/utils/access-validator"
import { AnswerersFactory } from "~core/utils/answerers-factory"
import { ExtensionApi } from "~core/utils/extension-api"
import { generateQuestionKey } from "~core/utils/generate-question-key"
import { QuestionDatabase } from "~db/question-database"

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/attempt.php*"]
}

window.addEventListener("load", async () => {
    await AccessValidator.validate()

    // TODO: for production set window.localStorage to chrome.storage.local
    // TODO: adding provider for extension mode
    let currentExtensionMode: ExtensionMode =
        await ExtensionApi.getCurrentMode()

    if (currentExtensionMode !== ExtensionMode.disabled) {
        console.log("Disabled mode")
        return
    }

    let ques = document.querySelectorAll(".que") as NodeListOf<HTMLElement>

    ques.forEach((que, i) => {
        let key: string = generateQuestionKey(que)

        QuestionDatabase.get(key).then((question) => {
            if (!question) {
                console.log("Not found", key)
                return
            }

            let answerer: IAnswerer = AnswerersFactory.getAnswerer(
                question.type
            )

            if (!answerer) {
                console.log("Answerer not found", question.type)
                return
            }

            try {
                switch (currentExtensionMode) {
                    case ExtensionMode.exam:
                        answerer.exam(que, question)
                        break
                    case ExtensionMode.hack:
                        answerer.hack(que, question)
                        break
                    case ExtensionMode.adventure:
                        answerer.adventure(que, question)
                        break
                    default:
                        console.warn("Unsupported extension mode", i)
                }
            } catch (e) {
                console.warn(e, i)
            }
        })
    })
})
