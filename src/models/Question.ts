import type {QuestionType} from "~models/QuestionType";

export declare type Question = {
    text: string,
    type: QuestionType,
    correctAnswers: string[],
    incorrectAnswers: string[]
};
