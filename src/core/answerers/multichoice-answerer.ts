import type {IAnswerer} from "~core/interfaces/answerer";
import type {Question} from "~core/models/question";
import type {MultichoiceAnswer} from "~core/models/answers/multichoice-answer";

export class MultichoiceAnswerer implements IAnswerer {
    answer(que: HTMLElement, question: Question) {
        let answer = question.answer as MultichoiceAnswer;
        let rows = que.querySelectorAll(".answer>[class^=r]");

        rows.forEach(row => {
            let input : HTMLInputElement = row.querySelector("input[type=radio], input[type=checkbox]");
            let answerLabel = row.querySelector("[data-region^=answer-label]>:last-child");

            let index = answer.correctAnswers.indexOf(answerLabel.textContent);
            if (index >= 0) {
                // TODO: Think about removing selected points (for optimization)
                //  Object.assert(dest, question);
                //  answer.correctAnswers.splice(index, 1);
                input.checked = true;

                // If the type is not checkbox, then we don't need to look at the other rows
                if (input.type !== "checkbox") return;
            }
        })
    }
}
