import type {Question} from "~core/models/question";

export interface IAnswerer {
    toExam(que : HTMLElement, question : Question);
    toAdventure(que : HTMLElement, question : Question);
    toHack(que : HTMLElement, question : Question);
}
