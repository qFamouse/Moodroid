import type { QuestionState } from "~core/enums/question-state"
import type { IAnswer } from "~core/interfaces/answer"

export class MatchAnswer implements IAnswer {
    public answers: {
        [text: string]: {
            correctAnswer?: string
            incorrectAnswers: string[]
        }
    } = {}
    public state: QuestionState
}
