import type { Question } from "~core/models/question";
import type { QuestionSaveResolveStatus } from "~core/types/question-save-resolve-status";

export interface IQuestionSaveResolver {
    resolve(question: Question, questionKey: string): Promise<QuestionSaveResolveStatus>;
    getSaveResolveStatus(questionToSave: Question, existingQuestion?: Question): QuestionSaveResolveStatus;
}
