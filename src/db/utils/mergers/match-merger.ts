import type { IAnswerMerger } from "~core/interfaces/answer-merger";
import type { MatchAnswer } from "~core/models/answers/match-answer";

type MatchAnswerAnswer = {
    correctAnswer?: string;
    incorrectAnswers: string[];
};

type MatchAnswerAnswers = {
    [text: string]: MatchAnswerAnswer;
};

export class MatchMerger implements IAnswerMerger {
    merge(answerInDb: MatchAnswer, answerToImport: MatchAnswer): MatchAnswer {
        let answers: MatchAnswerAnswers = {};

        // copy answers from db
        Object.keys(answerInDb.answers).forEach((text) => {
            let answer: MatchAnswerAnswer = { incorrectAnswers: [] };

            if (answerInDb.answers[text].correctAnswer) answer.correctAnswer = answerInDb.answers[text].correctAnswer;
            answer.incorrectAnswers = [...answerInDb.answers[text].incorrectAnswers];

            answers[text] = answer;
        });

        // merge with answers to import
        Object.keys(answerToImport.answers).forEach((text) => {
            let answer: MatchAnswerAnswer = { incorrectAnswers: [] };

            if (answerToImport.answers[text].correctAnswer) answer.correctAnswer = answerToImport.answers[text].correctAnswer;
            answer.incorrectAnswers = [...answerToImport.answers[text].incorrectAnswers];

            if (!answers[text]) {
                answers[text] = answer;
            } else {
                if (answer.correctAnswer) answers[text].correctAnswer = answer.correctAnswer;

                let incorrectAnswers: Set<string> = new Set(answer.incorrectAnswers);
                answers[text].incorrectAnswers.forEach((value) => {
                    incorrectAnswers.add(value);
                });

                answer.incorrectAnswers = [...incorrectAnswers];
            }
        });

        return {
            answers: answers,
            state: answerToImport.state
        };
    }
}
