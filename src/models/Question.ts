import type { QuestionType } from "~models/QuestionType";
import type { IAnswer } from "./answers/IAnswer";

export class Question {
  constructor(
    readonly text: string, 
    readonly type: QuestionType, 
    readonly answer: IAnswer
  ) { }
};
