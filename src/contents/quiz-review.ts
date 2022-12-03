import type { PlasmoContentScript } from "plasmo"

import type { Question } from "~core/models/question"
import { QuestionParser } from "~core/parsers/question-parser"
import { AccessValidator } from "~core/utils/access-validator"
import { generateQuestionKey } from "~core/utils/generate-question-key"
import { QuestionDatabase } from "~db/question-database"

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/review.php*"]
}

window.addEventListener("load", async () => {
    await AccessValidator.validate()

    let ques = document.querySelectorAll(".que") as NodeListOf<HTMLElement>
    ques.forEach((que, i) => {
        try {
            let question: Question = QuestionParser.parse(que)

            if (!question) {
                console.log("Can't parse")
                return
            }

            console.log("Parsed question", question)

            let key = generateQuestionKey(que)
            QuestionDatabase.add(key, question)
        } catch (e) {
            console.warn(e, i + 1)
        }
    })
})
