import { Shortanswer } from "~models/answers/Shortanswer";
import { QuestionsUtil } from "~utils/QuestionsUtil";
import type { IAnswerParser } from "./IAnswerParser";

export class ShortanswerParser implements IAnswerParser {
  
  parse(que: HTMLElement): Shortanswer {
    let text: string = this.parseText(que);

    if (!text) return;

    return new Shortanswer(text);
  }

  private parseText(que : HTMLElement): string {
    if (QuestionsUtil.isCorrect(que)) {
      return QuestionsUtil.getInput(que)?.value;
    }
  }
}