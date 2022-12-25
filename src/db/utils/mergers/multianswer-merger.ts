import type { QuestionState } from "~core/enums/question-state";
import type { IAnswerMerger } from "~core/interfaces/answer-merger";
import type { MultianswerAnswer } from "~core/models/answers/multianswer-answer";
import { maxQuestionState } from "~core/utils/question-state-utils";

export class MultianswerMerger implements IAnswerMerger {
    merge(answerInDb: MultianswerAnswer, answerToImport: MultianswerAnswer): MultianswerAnswer {
        let answers: string[] = [...answerInDb.answers];
        let newAnswers: string[] = answerToImport.answers;
        let newState: QuestionState = maxQuestionState(answerInDb.state, answerToImport.state);

        for (let i = 0; i < newAnswers.length; i++) {
            if (newAnswers[i]) answers[i] = newAnswers[i];
        }

        return {
            answers: answers,
            state: newState
        };
    }
}
