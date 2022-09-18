import type {PlasmoContentScript} from "plasmo"
import {QuizParser} from "~utils/QuizParser";
import {squeezeText} from "~utils/squeezeText";
import {QuestionDatabase} from "~utils/QuestionDatabase";
import {QuestionType} from "~models/QuestionType";
import {isVerifiedUser} from "~utils/isVerifiedUser";

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/attempt.php*"]
}

window.addEventListener("load", async () => {
    if (await isVerifiedUser()) {

        let ques = document.querySelectorAll('.que') as NodeListOf<HTMLElement>;

        ques.forEach(que => {
            let squeezedQueText = squeezeText(QuizParser.getQuestionText(que));

            QuestionDatabase.get(squeezedQueText).then(question => {
                if (question != undefined) {
                    switch (QuizParser.getQuestionType(que.classList)) {
                        case QuestionType.multichoice:
                            QuizParser.getQuestionAnswersAsElements(que).forEach(answer => {
                                question.correctAnswers.forEach(correctAnswer => {
                                    if (answer.text.textContent == correctAnswer) {
                                        // TODO: Tip for multichoice
                                        (answer.parent.querySelector("input[type=checkbox], input[type=radio]") as HTMLInputElement).checked = true;
                                    }
                                })
                            })
                            break;

                        case QuestionType.shortanswer:
                        case QuestionType.essay:
                            let inputs = QuizParser.getQuestionAnswersAsElements(que);
                            // TODO: stupid check == 1, but not check != 0
                            if (question.correctAnswers.length == 1 && inputs.length == 1) {
                                // TODO: Tip for written answer
                                inputs[0].input.value = question.correctAnswers[0];
                            } else if (question.correctAnswers.length == 0) {
                                console.log("There is no answer to this question in the database")
                            } else {
                                throw new Error(`There is more than one answer for one input.`)

                            }
                            break;

                        case QuestionType.match:
                            QuizParser.getQuestionAnswersAsElements(que).forEach(answer => {
                                let correctAnswerIndex = question.correctAnswers.indexOf(answer.text.textContent);
                                answer.input.querySelectorAll("option").forEach(option => {
                                    if (option.text == question.correctAnswers[correctAnswerIndex + 1]) {
                                        option.selected = true;
                                    }
                                })
                            })

                            break;

                        default:
                            throw new Error("Unsupported type")
                    }
                } else {
                    console.log("There are no matches on the question")
                }
            })
        })
    }
})


