import type { IAnswerer } from "~answerers/IAnswerer";
import { ShortanswerAnswerer } from "~answerers/ShortanswerAnswerer";
import { QuestionType } from "~models/QuestionType";

export class AnswerersFactory {

  private static questionTypeAnswerer: Map<QuestionType, () => IAnswerer> = new Map<QuestionType, () => IAnswerer>([
    [QuestionType.shortanswer, () => new ShortanswerAnswerer()],
  ]);

  static getAnswerer(questionType: QuestionType): IAnswerer | undefined {
    let constuctor: () => IAnswerer = AnswerersFactory.questionTypeAnswerer.get(questionType);

    if (!constuctor) return;

    return constuctor();
  }
}