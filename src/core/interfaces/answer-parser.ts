import type { IAnswer } from "~core/interfaces/answer";
import type { QuestionState } from "~core/enums/question-state";

export interface IAnswerParser {
    parse(que : HTMLElement): IAnswer;
    forceParse(que : HTMLElement, forceState : QuestionState): IAnswer;
}
