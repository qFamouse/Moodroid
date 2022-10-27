import type {IAnswer} from "~core/interfaces/answer";
import type {QuestionState} from "~core/enums/question-state";

export class MultianswerAnswer implements IAnswer {
    public answers : string[]

    constructor() {
        this.answers = [];
    }

    public state: QuestionState;
}
