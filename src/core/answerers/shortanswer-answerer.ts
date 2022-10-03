import type {IAnswerer} from "~core/interfaces/answerer";
import type {Question} from "~core/models/question";
import type {ShortanswerAnswer} from "~core/models/answers/shortanswer-answer";

export class ShortanswerAnswerer implements IAnswerer {
    answer(que: HTMLElement, question: Question) {
        let answer = question.answer as ShortanswerAnswer;

        let input : HTMLInputElement = que.querySelector(".answer>input");
        if (input) {
            input.value = answer.answer;
        }
    }
}