import type { QuestionSaveResolveType } from "~core/enums/question-save-resolve-type";
import type { Question } from "~core/models/question";

export declare type QuestionSaveResolveStatus = {
    question: Question;
    type: QuestionSaveResolveType;
};
