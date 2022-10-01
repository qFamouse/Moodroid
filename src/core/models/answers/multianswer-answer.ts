import type {IAnswer} from "~core/interfaces/answer";

export class MultianswerAnswer implements IAnswer {
    public answers : string[]

    constructor() {
        this.answers = [];
    }
}
