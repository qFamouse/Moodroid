import type {Question} from "~core/models/Question";

export interface IAnswerer {
    answer(que : HTMLElement, question : Question)
}
