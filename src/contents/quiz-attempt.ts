import type {PlasmoContentScript} from "plasmo"
import {QuizParser} from "~utils/QuizParser";
import {squeezeText} from "~utils/squeezeText";
import {QuestionDatabase} from "~utils/QuestionDatabase";
import {QuestionType} from "~models/QuestionType";
import {isVerifiedUser} from "~utils/isVerifiedUser";
import {fillInput} from "~utils/fillInput";

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/attempt.php*"]
}

window.addEventListener("load", async () => {
    if (await isVerifiedUser()) {

        let status = CreateStatus();

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
                                        answer.text.addEventListener('mouseover', (event) => {
                                            status.style.display = 'block';
                                        });
                                        answer.text.addEventListener('mouseout', (event) => {
                                            status.style.display = 'none';
                                        });

                                        // (answer.parent.querySelector("input[type=checkbox], input[type=radio]") as HTMLInputElement).checked = true;
                                    }
                                })
                            })
                            break;

                        case QuestionType.shortanswer:
                        case QuestionType.essay:
                            let inputs = QuizParser.getQuestionAnswersAsElements(que);
                            if (question.correctAnswers.length == 1 && inputs.length == 1) {
                                // TODO: Tip for written answer
                                console.log(inputs[0].input);
                                console.log(question.correctAnswers[0]);
                                fillInput(inputs[0].input, question.correctAnswers[0]);

                                // inputs[0].input.value = question.correctAnswers[0];
                            } else if (question.correctAnswers.length == 0) {
                                console.log("There is no answer to this question in the database")
                            } else {
                                throw new Error(`There is more than one answer for one input.`)

                            }
                            break;

                        case QuestionType.match:
                            QuizParser.getQuestionAnswersAsElements(que).forEach(answer => {
                                let correctAnswerIndex = question.correctAnswers.indexOf(answer.text.textContent);

                                if (correctAnswerIndex >= 0) {
                                    answer.input.querySelectorAll("option").forEach(option => {
                                        // TODO: more cycles, need to optimize
                                        if (option.textContent == question.correctAnswers[correctAnswerIndex + 1]) {

                                            option.style.fontStyle = 'italic'

                                            // option.selected = true;
                                        }
                                    })
                                }
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

function CreateStatus() {
    let status = document.createElement("div");
    status.innerHTML = "•";
    status.style.position = 'fixed';
    status.style.fontSize = "20px";
    status.style.bottom = '20px'
    status.style.left = '20px'
    status.style.display = 'none'
    document.body.appendChild(status);
    return status;
}


