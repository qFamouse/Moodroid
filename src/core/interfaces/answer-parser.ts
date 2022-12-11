import type { QuestionState } from "~core/enums/question-state";
import type { IAnswer } from "~core/interfaces/answer";

export interface IAnswerParser {
    parse(que: HTMLElement): IAnswer;

    forceParse(que: HTMLElement, forceState: QuestionState): IAnswer;
}
