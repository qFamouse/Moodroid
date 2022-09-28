import { QuestionType } from "~models/QuestionType";
import type { IAnswerParser } from "~parsers/answers/IAnswerParser";
import { ShortanswerParser } from "~parsers/answers/ShortanswerParser";

export class AnswerParserFactory {

  private static questionTypeAnswerParser: Map<QuestionType, () => IAnswerParser> = new Map<QuestionType, () => IAnswerParser>([
    [QuestionType.shortanswer, () => new ShortanswerParser()],
  ]);

  static getAnswerParser(questionType: QuestionType): IAnswerParser | undefined {
    let constuctor: () => IAnswerParser = AnswerParserFactory.questionTypeAnswerParser.get(questionType);

    if (!constuctor) return;

    return constuctor();
  }
}