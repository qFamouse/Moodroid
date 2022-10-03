import type {PlasmoContentScript} from "plasmo"
import {squeezeText} from "~core/utils/squeeze-text";
import {QuestionDatabase} from "~db/question-database";
import {QuestionType} from "~core/enums/question-type";
import {fillInput} from "~core/utils/fill-Input";
import {parseQuestionText} from "~core/utils/parse/parse-question-text";
import {generateQuestionKey} from "~core/utils/generate-question-key";
import type {IAnswerer} from "~core/interfaces/answerer";
import {AnswerersFactory} from "~core/utils/answerers-factory";

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/attempt.php*"]
}

window.addEventListener("load", async () => {
    let ques = document.querySelectorAll('.que') as NodeListOf<HTMLElement>;

    ques.forEach(que => {
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

            answerer.answer(que, question);
        })
    })


    // if (await isVerifiedUser()) {
    //
    //     let status = CreateStatus();
    //
    //     let ques = document.querySelectorAll('.que') as NodeListOf<HTMLElement>;
    //
    //     ques.forEach(que => {
    //         let squeezedQueText = squeezeText(QuizParser.getQuestionText(que));
    //
    //         QuestionDatabase.get(squeezedQueText).then(question => {
    //             if (question != undefined) {
    //                 switch (QuizParser.getQuestionType(que.classList)) {
    //                     case QuestionType.multichoice:
    //                         QuizParser.getQuestionAnswersAsElements(que).forEach(answer => {
    //                             question.correctAnswers.forEach(correctAnswer => {
    //                                 if (answer.text.textContent == correctAnswer) {
    //                                     // TODO: Tip for multichoice
    //
    //                                     // answer.text.addEventListener('mouseover', (event) => {
    //                                     //     status.style.display = 'block';
    //                                     // });
    //                                     // answer.text.addEventListener('mouseout', (event) => {
    //                                     //     status.style.display = 'none';
    //                                     // });
    //
    //                                     // (answer.parent.querySelector("input[type=checkbox], input[type=radio]") as HTMLInputElement).checked = true;
    //
    //                                     if (question.correctAnswers.indexOf(answer.text.textContent) >= 0) {
    //                                         answer.text.style.background = 'green';
    //                                     }
    //                                     else if (question.incorrectAnswers.indexOf(answer.text.textContent) >= 0) {
    //                                         answer.text.style.background = 'red';
    //                                     }
    //                                 }
    //                             })
    //                         })
    //                         break;
    //
    //                     case QuestionType.shortanswer:
    //                     case QuestionType.essay:
    //                         let inputs = QuizParser.getQuestionAnswersAsElements(que);
    //                         if (question.correctAnswers.length == 1 && inputs.length == 1) {
    //                             // TODO: Tip for written answer
    //                             console.log(inputs[0].input);
    //                             console.log(question.correctAnswers[0]);
    //
    //                             // fillInput(inputs[0].input, question.correctAnswers[0]);
    //
    //                             inputs[0].input.value = question.correctAnswers[0];
    //
    //                         } else if (question.correctAnswers.length == 0) {
    //                             console.log("There is no answer to this question in the database")
    //                         } else {
    //                             throw new Error(`There is more than one answer for one input.`)
    //
    //                         }
    //                         break;
    //
    //                     case QuestionType.match:
    //                         QuizParser.getQuestionAnswersAsElements(que).forEach(answer => {
    //                             let correctAnswerIndex = question.correctAnswers.indexOf(answer.text.textContent);
    //
    //                             if (correctAnswerIndex >= 0) {
    //                                 answer.input.querySelectorAll("option").forEach(option => {
    //                                     // TODO: more cycles, need to optimize
    //                                     if (option.textContent == question.correctAnswers[correctAnswerIndex + 1]) {
    //
    //                                         option.style.background = 'green'
    //
    //                                         // option.style.fontStyle = 'italic'
    //
    //                                         // option.selected = true;
    //                                     }
    //                                 })
    //                             }
    //                         })
    //
    //                         break;
    //
    //                     default:
    //                         throw new Error("Unsupported type")
    //                 }
    //             } else {
    //                 console.log("There are no matches on the question")
    //             }
    //         })
    //     })
    // }
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


