import type { QuestionState } from "~core/enums/question-state"
import type { IAnswer } from "~core/interfaces/answer"

export class EssayAnswer implements IAnswer {
    public answer: string
    public state: QuestionState
}
