import { QuestionState } from "~core/enums/question-state";

/**
 * @returns state with minimum ordinal
 */
export function maxQuestionState(state1: QuestionState, state2: QuestionState): QuestionState {
  return compareQuestionState(state1, state2) >= 0 ? state1 : state2; 
}

/**
 * @returns positive if state1 > state2
 */
export function compareQuestionState(state1: QuestionState, state2: QuestionState): number {
  return ordinal(state2) - ordinal(state1);
}

function ordinal(key: string): number {
  return Object.getOwnPropertyNames(QuestionState).indexOf(key);
}
