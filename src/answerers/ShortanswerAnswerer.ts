import type { Shortanswer } from "~models/answers/Shortanswer";
import type { Question } from "~models/Question";
import { fillInput } from "~utils/fillInput";
import { QuestionsUtil } from "~utils/QuestionsUtil";
import type { IAnswerer } from "./IAnswerer";

export class ShortanswerAnswerer implements IAnswerer {

  answer(que: HTMLElement, question: Question) {
    let answer: Shortanswer = question.answer as Shortanswer;
    let input: HTMLInputElement = this.getInput(que);
    fillInput(input, answer.text);
  }

  private getInput(que : HTMLElement): HTMLInputElement {
    return QuestionsUtil.getInput(que);
  }
}