import type {IAnswerer} from "~core/interfaces/answerer";
import type {Question} from "~models/Question";
import type {EssayAnswer} from "~core/models/answers/essay-answer";

export class EssayAnswerer implements IAnswerer {
    answer(que: HTMLElement, question: Question) {
        let answer = question.answer as EssayAnswer;

        let divEditor : HTMLElement = que.querySelector(".answer .editor_atto_content.form-control");
        // Very rare situation with custom textarea
        if (divEditor) {
            divEditor.textContent = answer.answer;
        }
        else {
            let textarea : HTMLTextAreaElement = que.querySelector(".answer>textarea");
            textarea.value = answer.answer;
        }
    }
}
