import type { Question } from "~core/models/question";
import type { QuestionSaveResolveStatus } from "~core/types/question-save-resolve-status";

export interface IQuestionSaveResolver {
  save(question: Question, questionKey: string): Promise<QuestionSaveResolveStatus>;
}