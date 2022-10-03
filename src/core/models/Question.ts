import type {QuestionType} from "~core/enums/QuestionType";
import type {IAnswer} from "~core/interfaces/answer";

export class Question {
    constructor(
        readonly text: string,
        readonly type: QuestionType,
        readonly answer: IAnswer
    ) { }
}
