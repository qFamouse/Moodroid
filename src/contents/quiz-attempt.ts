import type {PlasmoContentScript} from "plasmo"
import {QuizParser} from "~utils/QuizParser";
import {squeezeText} from "~utils/squeezeText";
import {Question, QuestionType} from "~models/Question";
import {QuestionDatabase} from "~utils/QuestionDatabase";
import {QuestionType} from "~models/QuestionType";

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/attempt.php*"]
}

window.addEventListener("load", () => {
    let ques = document.querySelectorAll('.que');

    ques.forEach(que => {
        let squeezedQueText = squeezeText(QuizParser.getQuestionText(que));

        QuestionDatabase.get(squeezedQueText).then(question => {
            if (question != undefined) {
                switch (QuizParser.getQuestionType(que.classList)) {
                    case QuestionType.multichoice:
                        let rows = QuizParser.getQuestionRows(que);
                        rows.forEach(row => {
                            console.log(question.answers);
                            question.answers.forEach(answer => {
                                if (squeezeText(QuizParser.getQuestionTextFromRow(row)) == squeezeText(answer)) {
                                    // TODO: Tip for multichoice
                                    (row.querySelector("input[type=checkbox], input[type=radio]") as HTMLInputElement).checked = true;
                                }
                            })
                        })
                        break;

                    case QuestionType.shortanswer:
                    case QuestionType.essay:
                        let input = QuizParser.getQuestionInput(que);
                        if (question.answers.length == 1) {
                            // TODO: Tip for written answer
                            input.value = question.answers[0];
                        } else {
                            question.answers.forEach(answer => console.log(answer));
                            throw new Error(`There is more than one answer for one input.`)
                        }
                        break;

                    case QuestionType.match:
                        QuizParser.getMatchElements(que).forEach(matchQuestion => {
                            let textIndex = question.answers.indexOf(matchQuestion.text.textContent);
                            matchQuestion.getOptions().forEach(option => {
                                // TODO: Tip for match answer
                                if (squeezeText(option.text) == squeezeText(question.answers[textIndex+1])) {
                                    option.selected = true;
                                }
                            })
                        })

                        break;

                    default:
                        throw new Error("Unsupported type")
                }
            }
            else {
                console.log("There are no matches on the question")
            }
        })
    })
})


