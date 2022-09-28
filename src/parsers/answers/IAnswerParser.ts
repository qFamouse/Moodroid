import type { IAnswer } from "~models/answers/IAnswer";

export interface IAnswerParser {
  parse(que: HTMLElement): IAnswer;
}