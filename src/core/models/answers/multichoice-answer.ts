import type {IAnswer} from "~core/interfaces/answer";
import type {QuestionState} from "~core/enums/question-state";

export class MultichoiceAnswer implements IAnswer {
    public correctAnswers : string[];
    public incorrectAnswers : string[];
    public state: QuestionState;
}
