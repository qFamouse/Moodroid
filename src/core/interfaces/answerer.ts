import type { Question } from "~core/models/question";

export interface IAnswerer {
    exam(que: HTMLElement, question: Question);

    adventure(que: HTMLElement, question: Question);

    hack(que: HTMLElement, question: Question);
}
