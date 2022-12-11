import type { QuestionType } from "~core/enums/question-type";
import type { IAnswer } from "~core/interfaces/answer";
import type { IAnswerMerger } from "~core/interfaces/answer-merger";
import type { IQuestionMerger } from "~core/interfaces/question-merger";
import { Question } from "~core/models/question";

import { AnswerMergerFactory } from "./answer-merger-factory";

export class DbQuestionMerger implements IQuestionMerger {
    constructor() {}

    public merge(questionInDb: Question, questionToSave: Question): Question {
        let type: QuestionType = questionToSave.type;
        let text: string = questionToSave.text;
        let merger: IAnswerMerger = AnswerMergerFactory.getAnswerMerger(type);

        if (!merger) {
            let message: string = `Can't save question \
        no answer merger found (${questionInDb.answer.state}, ${questionInDb.answer.state})`;
            console.debug(message);
            throw new Error(message);
        }

        let mergedAnswer: IAnswer = merger.merge(questionInDb.answer, questionToSave.answer);
        return new Question(text, type, mergedAnswer);
    }
}
