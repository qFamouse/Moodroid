import type { IAnswerMerger } from "~core/interfaces/answer-merger";
import type { MultianswerAnswer } from "~core/models/answers/multianswer-answer";

export class MultianswerMerger implements IAnswerMerger {
    merge(answerInDb: MultianswerAnswer, answerToImport: MultianswerAnswer): MultianswerAnswer {
        let answers: string[] = [...answerInDb.answers];
        let newAnswers: string[] = answerToImport.answers;

        for (let i = 0; i < newAnswers.length; i++) {
            if (newAnswers[i]) answers[i] = newAnswers[i];
        }

        return {
            answers: answers,
            state: answerToImport.state
        };
    }
}
