import type { IAnswerer } from "~core/interfaces/answerer";
import type { MultianswerAnswer } from "~core/models/answers/multianswer-answer";
import type { Question } from "~core/models/question";
import { fillInput } from "~core/utils/fill-input";

interface IMultianswerAction {
    (inputElement: HTMLInputElement, concreteAnswer: string): void;
}

export class MultianswerAnswerer implements IAnswerer {
    private static handler(que: HTMLElement, question: Question, correctAction: IMultianswerAction): void {
        let answer = question.answer as MultianswerAnswer;
        let answerContainer: HTMLElement = que.querySelector("input[type=hidden]+p+p");
        let inputs: NodeListOf<HTMLInputElement> = answerContainer.querySelectorAll("input");

        for (let i = 0; i < inputs.length; i++) {
            correctAction(inputs[i], answer.answers[i]);
        }
    }

    adventure = this.hack;

    exam(que: HTMLElement, question: Question) {
        let correctAction: IMultianswerAction = (inputElement: HTMLInputElement, concreteAnswer: string): void => {
            fillInput(inputElement, concreteAnswer);
        };

        MultianswerAnswerer.handler(que, question, correctAction);
    }

    hack(que: HTMLElement, question: Question) {
        let correctAction: IMultianswerAction = (inputElement: HTMLInputElement, concreteAnswer: string): void => {
            inputElement.value = concreteAnswer;
        };

        MultianswerAnswerer.handler(que, question, correctAction);
    }

    roll(que: HTMLElement, question?: Question) {
        return question ? this.hack : undefined;
    }
}
