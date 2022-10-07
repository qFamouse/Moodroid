import type {IAnswer} from "~core/interfaces/answer";
import type {QuestionState} from "~core/enums/question-state";

export class ShortanswerAnswer implements IAnswer {
    public answer : string;
    public state: QuestionState;
}
