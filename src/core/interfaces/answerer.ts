import type { Question } from "~core/models/question"

export interface IAnswerer {
    answer(que: HTMLElement, question: Question)
}
