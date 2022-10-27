import type { PlasmoContentScript } from "plasmo"

import type { IAnswerer } from "~core/interfaces/answerer"
import { AnswerersFactory } from "~core/utils/answerers-factory"
import { generateQuestionKey } from "~core/utils/generate-question-key"
import { QuestionDatabase } from "~db/question-database"

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/attempt.php*"]
}

window.addEventListener("load", async () => {
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
                answerer.answer(que, question)
            } catch (e) {
                console.warn(e, i)
            }
        })
    })
})
