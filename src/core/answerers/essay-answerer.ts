import type {IAnswerer} from "~core/interfaces/answerer";
import type {Question} from "~core/models/question";
import type {EssayAnswer} from "~core/models/answers/essay-answer";
import {fillInput} from "~core/utils/fill-input";

interface IEssayAction {
    (textAreaElement : HTMLTextAreaElement): void
}

export class EssayAnswerer implements IAnswerer {
    private static handler(
        que: HTMLElement,
        question : Question,
        correctAction : IEssayAction
    ) : void {
        let answer = question.answer as EssayAnswer;

        // Very rare situation with custom textarea
        let divEditor : HTMLElement = que.querySelector(".answer .editor_atto_content.form-control");
        if (divEditor) {
            divEditor.textContent = answer.answer;
            return
        }

        let textarea : HTMLTextAreaElement = que.querySelector(".answer>textarea");

        correctAction(textarea);
    }

    adventure = this.hack;

    exam(que: HTMLElement, question: Question) {
        let correctAction = (textAreaElement : HTMLTextAreaElement) => {
            fillInput(textAreaElement, (question.answer as EssayAnswer).answer)
        }

        EssayAnswerer.handler(que, question, correctAction);
    }

    hack(que: HTMLElement, question: Question) {
        let correctAction = (textAreaElement : HTMLTextAreaElement) => {
            textAreaElement.value = (question.answer as EssayAnswer).answer;
        }

        EssayAnswerer.handler(que, question, correctAction);
    }
}
