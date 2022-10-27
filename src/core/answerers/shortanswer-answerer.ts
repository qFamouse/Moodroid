import type {IAnswerer} from "~core/interfaces/answerer";
import type {Question} from "~core/models/question";
import type {ShortanswerAnswer} from "~core/models/answers/shortanswer-answer";
import {fillInput} from "~core/utils/fill-input";

interface IShortanswerAction {
    (inputElement : HTMLInputElement): void
}

export class ShortanswerAnswerer implements IAnswerer {
    private static handler(
        que: HTMLElement,
        question : Question,
        correctAction : IShortanswerAction
    ) : void {
        let input : HTMLInputElement = que.querySelector(".answer>input");
        if (input) {
            correctAction(input);
        }
    }

    adventure = this.hack;

    exam(que: HTMLElement, question: Question) {
        let correctAction : IShortanswerAction = (inputElement : HTMLInputElement) => {
            fillInput(inputElement, (question.answer as ShortanswerAnswer).answer)
        }

        ShortanswerAnswerer.handler(que, question, correctAction);
    }

    hack(que: HTMLElement, question: Question) {
        let correctAction : IShortanswerAction = (inputElement : HTMLInputElement) => {
            inputElement.value = (question.answer as ShortanswerAnswer).answer;
        }

        ShortanswerAnswerer.handler(que, question, correctAction);
    }
}
