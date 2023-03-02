import { QuestionSaveResolveType } from "~core/enums/question-save-resolve-type";
import { QuestionState } from "~core/enums/question-state";
import type { IQuestionSaveResolver } from "~core/interfaces/question-save-resolver";
import type { Question } from "~core/models/question";
import type { QuestionSaveResolveStatus } from "~core/types/question-save-resolve-status";

import { retrieveQuestion } from "../indexeddb";
import { DbQuestionMerger } from "../mergers/db-question-merger";

export class MultianswerQuestionSaveResolver implements IQuestionSaveResolver {
    resolve(questionToSave: Question, questionKey: string): Promise<QuestionSaveResolveStatus> {
        return new Promise((onResolved, reject) => {
            console.debug("MultianswerQuestionSaveResolver", "resolve()", questionToSave, questionKey);

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
            case QuestionState.partiallycorrect:
            case QuestionState.incorrect:
                return this.ignoreAndWriteCorrectAndMergePartiallyCorrect(questionInDb, questionToSave);
            case QuestionState.explicit:
                return this.writeAndIgnoreIncorrect(questionInDb, questionToSave);
            default:
                return { question: questionInDb, type: QuestionSaveResolveType.Ignore };
        }
    }

    private ignoreAndWriteCorrectAndMergePartiallyCorrect(questionInDb: Question, questionToSave: Question): QuestionSaveResolveStatus {
        switch (questionToSave.answer.state) {
            case QuestionState.correct:
                return { question: questionToSave, type: QuestionSaveResolveType.Write };
            case QuestionState.partiallycorrect:
                let merger: DbQuestionMerger = new DbQuestionMerger();
                let questionMerged: Question = merger.merge(questionInDb, questionToSave);
                return { question: questionMerged, type: QuestionSaveResolveType.Merge };
            default:
                return { question: questionInDb, type: QuestionSaveResolveType.Ignore };
        }
    }

    private writeAndIgnoreIncorrect(questionInDb: Question, questionToSave: Question): QuestionSaveResolveStatus {
        switch (questionToSave.answer.state) {
            case QuestionState.incorrect:
                return { question: questionInDb, type: QuestionSaveResolveType.Ignore };
            default:
                return { question: questionToSave, type: QuestionSaveResolveType.Write };
        }
    }
}
