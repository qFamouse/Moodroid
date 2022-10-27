import type { IAnswer } from "~core/interfaces/answer"
import type { IAnswerMerger } from "~core/interfaces/answer-merger"

export class AnswerOverwriteMerger implements IAnswerMerger {
    merge(answerInDb: IAnswer, answerToImport: IAnswer): IAnswer {
        return answerToImport
    }
}
