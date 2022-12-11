import type { IAnswerMerger } from "~core/interfaces/answer-merger"
import type { MultichoiceAnswer } from "~core/models/answers/multichoice-answer"

export class MultichoiceMerger implements IAnswerMerger {
    merge(
        answerInDb: MultichoiceAnswer,
        answerToImport: MultichoiceAnswer
    ): MultichoiceAnswer {
        let correctAnswers: Set<string> = new Set()
        let incorrectAnswers: Set<string> = new Set()

        answerInDb.correctAnswers.forEach((value) => {
            correctAnswers.add(value)
        })
        answerInDb.incorrectAnswers.forEach((value) => {
            incorrectAnswers.add(value)
        })
        answerToImport.correctAnswers.forEach((value) => {
            correctAnswers.add(value)
        })
        answerToImport.incorrectAnswers.forEach((value) => {
            incorrectAnswers.add(value)
        })

        return {
            correctAnswers: [...correctAnswers],
            incorrectAnswers: [...incorrectAnswers],
            state: answerToImport.state
        }
    }
}
