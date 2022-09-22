import type {QuestionType} from "~models/QuestionType";
import type {QuestionState} from "~parser/QuestionState";

export interface IQuestionParser {

    get questionType() : QuestionType;

    get questionText() : string;

    get questionState() : QuestionState;

    get questionImages() : Array<HTMLImageElement>;

}
