import { QuestionSaveResolveType } from "~core/enums/question-save-resolve-type";
import type { IQuestionSaveResolver } from "~core/interfaces/question-save-resolver";
import type { Question } from "~core/models/question";
import type { QuestionSaveResolveStatus } from "~core/types/question-save-resolve-status";

import { retrieveQuestion } from "../indexeddb";
import { DbQuestionMerger } from "../mergers/db-question-merger";

export class MultichoiseQuestionSaveResolver implements IQuestionSaveResolver {
    resolve(questionToSave: Question, questionKey: string): Promise<QuestionSaveResolveStatus> {
        return new Promise((onResolved, reject) => {
            console.debug("MultichoiseQuestionSaveResolver", "resolve()", questionToSave, questionKey);

            retrieveQuestion(questionKey)
                .then((questionInDb) => {
                    if (!questionInDb) {
                        onResolved({ question: questionToSave, type: QuestionSaveResolveType.Write });
                        return;
                    }
                    let merger: DbQuestionMerger = new DbQuestionMerger();
                    let questionMerged: Question = merger.merge(questionInDb, questionToSave);
                    onResolved({ question: questionMerged, type: QuestionSaveResolveType.Merge });
                })
                .catch((reason) => reject(reason));
        });
    }
}
