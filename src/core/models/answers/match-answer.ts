import type {IAnswer} from "~core/interfaces/answer";
import type {QuestionState} from "~core/enums/question-state";

export class MatchAnswer implements IAnswer {
    public answers : {
        [text : string]: {
            correctAnswer?: string,
            incorrectAnswers : string[]
        }
    } = {}
    public state: QuestionState;
}
