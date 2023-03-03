import { QuestionSaveResolveType } from "~core/enums/question-save-resolve-type";
import type { IQuestionSaveResolver } from "~core/interfaces/question-save-resolver";
import type { Question } from "~core/models/question";
import type { QuestionSaveResolveStatus } from "~core/types/question-save-resolve-status";

import { retrieveQuestion } from "../indexeddb";
import { DbQuestionMerger } from "../mergers/db-question-merger";
import { QuestionState } from "~core/enums/question-state";

export class MatchQuestionSaveResolver implements IQuestionSaveResolver {
    resolve(questionToSave: Question, questionKey: string): Promise<QuestionSaveResolveStatus> {
        return new Promise((onResolved, reject) => {
            console.debug("MatchQuestionSaveResolver", "resolve()", questionToSave, questionKey);

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
            case QuestionState.explicit:
                return this.writeAndIgnoreIncorrect(questionInDb, questionToSave);
            default:
                return this.mergeAndIgnoreExplicit(questionInDb, questionToSave);
        }
    }

    private mergeAndIgnoreExplicit(questionInDb: Question, questionToSave: Question): QuestionSaveResolveStatus {
        switch (questionToSave.answer.state) {
            case QuestionState.explicit:
                return { question: questionInDb, type: QuestionSaveResolveType.Ignore };
            default:
                let merger: DbQuestionMerger = new DbQuestionMerger();
                let questionMerged: Question = merger.merge(questionInDb, questionToSave);
                return { question: questionMerged, type: QuestionSaveResolveType.Merge };
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
