import type { IAnswer } from "~core/interfaces/answer"

export interface IAnswerParser {
    parse(que: HTMLElement): IAnswer
}
