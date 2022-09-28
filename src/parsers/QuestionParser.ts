import type { IAnswer } from "~models/answers/IAnswer";
import { Question } from "~models/Question";
import { QuestionState } from "~models/QuestionState";
import type { QuestionType } from "~models/QuestionType";
import { AnswerParserFactory } from "~utils/AnswerParsersFactory";
import { QuestionsUtil } from "~utils/QuestionsUtil";

export class QuestionParser {

  static parse(que: HTMLElement): Question {
    if (!QuestionParser.canParse(que)) return;

    let type: QuestionType = QuestionsUtil.getQuestionType(que);
    let text: string = QuestionsUtil.getQuestionText(que);
    let answer: IAnswer = AnswerParserFactory.getAnswerParser(type)?.parse(que);

    if (type && text && answer) {
      return new Question(text, type, answer);
    }
  }

  private static canParse(que: HTMLElement): boolean {
    let state: QuestionState = QuestionsUtil.getQuestionState(que);
    return state === QuestionState.correct 
        || state === QuestionState.partiallycorrect;
  }
}