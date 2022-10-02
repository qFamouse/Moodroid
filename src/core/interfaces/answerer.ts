import type {Question} from "~models/Question";

export interface IAnswerer {
    answer(que : HTMLElement, question : Question)
}
