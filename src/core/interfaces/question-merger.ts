import type { Question } from "~core/models/question";

export interface QuestionMerger {
  merge(question1: Question, question2: Question): Question;
}