import type {IAnswer} from "~core/interfaces/answer";

export class MultichoiceAnswer implements IAnswer {
    public correctAnswers : string[];
    public incorrectAnswers : string[];
}
