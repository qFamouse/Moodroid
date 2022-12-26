import { QuestionSaveResolveType } from "~core/enums/question-save-resolve-type";
import { QuestionState } from "~core/enums/question-state";
import type { IQuestionSaveResolver } from "~core/interfaces/question-save-resolver";
import type { Question } from "~core/models/question";
import type { QuestionSaveResolveStatus } from "~core/types/question-save-resolve-status";

import { retrieveQuestion } from "../indexeddb";

export class ShortanswerQuestionSaveResolver implements IQuestionSaveResolver {
    resolve(questionToSave: Question, questionKey: string): Promise<QuestionSaveResolveStatus> {
        return new Promise((onResolved, reject) => {
            console.debug("ShortanswerQuestionSaveResolver", "resolve()", questionToSave, questionKey);

            retrieveQuestion(questionKey)
                .then((questionInDb) => {
                    let status: QuestionSaveResolveStatus = this.getSaveResolveStatus(questionToSave, questionInDb);
                    onResolved(status);
                })
                .catch((reason) => reject(reason));
        });
    }

    getSaveResolveStatus(questionToSave: Question, questionInDb: Question): QuestionSaveResolveStatus {
        if (!questionInDb) {
            return { question: questionToSave, type: QuestionSaveResolveType.Write };
        }

        switch (questionInDb.answer.state) {
            case QuestionState.correct:
                return { question: questionInDb, type: QuestionSaveResolveType.Ignore };
            case QuestionState.incorrect:
                return this.onStateIncorrect(questionInDb, questionToSave);
            case QuestionState.partiallycorrect:
                return this.onStatePartiallyCorrect(questionInDb, questionToSave);
            default:
                return { question: questionToSave, type: QuestionSaveResolveType.Write };
        }
    }

    private onStateIncorrect(questionInDb: Question, questionToSave: Question): QuestionSaveResolveStatus {
        switch (questionToSave.answer.state) {
            case QuestionState.incorrect:
                return { question: questionInDb, type: QuestionSaveResolveType.Ignore };
            default:
                return { question: questionToSave, type: QuestionSaveResolveType.Write };
        }
    }

    private onStatePartiallyCorrect(questionInDb: Question, questionToSave: Question): QuestionSaveResolveStatus {
        switch (questionToSave.answer.state) {
            case QuestionState.partiallycorrect:
            case QuestionState.incorrect:
                return { question: questionInDb, type: QuestionSaveResolveType.Ignore };
            default:
                return { question: questionToSave, type: QuestionSaveResolveType.Write };
        }
    }
}
