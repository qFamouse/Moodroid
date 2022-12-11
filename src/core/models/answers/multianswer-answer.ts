import type { QuestionState } from "~core/enums/question-state";
import type { IAnswer } from "~core/interfaces/answer";

export class MultianswerAnswer implements IAnswer {
    public answers: string[];
    public state: QuestionState;

    constructor() {
        this.answers = [];
    }
}
