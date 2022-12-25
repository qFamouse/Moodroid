import type { QuestionState } from "~core/enums/question-state";
import type { IAnswerMerger } from "~core/interfaces/answer-merger";
import type { MultichoiceAnswer } from "~core/models/answers/multichoice-answer";
import { maxQuestionState } from "~core/utils/question-state-utils";

export class MultichoiceMerger implements IAnswerMerger {
    merge(answerInDb: MultichoiceAnswer, answerToImport: MultichoiceAnswer): MultichoiceAnswer {
        let correctAnswers: Set<string> = new Set();
        let incorrectAnswers: Set<string> = new Set();
        let newState: QuestionState = maxQuestionState(answerInDb.state, answerToImport.state);

        answerInDb.correctAnswers.forEach((value) => {
            correctAnswers.add(value);
        });
        answerInDb.incorrectAnswers.forEach((value) => {
            incorrectAnswers.add(value);
        });
        answerToImport.correctAnswers.forEach((value) => {
            correctAnswers.add(value);
        });
        answerToImport.incorrectAnswers.forEach((value) => {
            incorrectAnswers.add(value);
        });

        return {
            correctAnswers: [...correctAnswers],
            incorrectAnswers: [...incorrectAnswers],
            state: newState
        };
    }
}
