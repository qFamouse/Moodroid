import type { QuestionState } from "~core/enums/question-state";
import type { IAnswer } from "~core/interfaces/answer";

export class MultichoiceAnswer implements IAnswer {
    public correctAnswers: string[];
    public incorrectAnswers: string[];
    public state: QuestionState;
}
