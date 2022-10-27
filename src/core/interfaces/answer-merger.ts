import type { IAnswer } from "./answer"

export interface IAnswerMerger {
    merge(answerInDb: IAnswer, answerToImport: IAnswer): IAnswer
}
