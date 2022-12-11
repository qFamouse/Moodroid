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
                    if (!questionInDb) {
                        onResolved({ question: questionToSave, type: QuestionSaveResolveType.Write });
                        return;
                    }

                    switch (questionInDb.answer.state) {
                        case QuestionState.correct:
                            onResolved({ question: questionInDb, type: QuestionSaveResolveType.Ignore });
                            break;
                        case QuestionState.incorrect:
                        case QuestionState.partiallycorrect:
                            this.onStateIncorrectOrPartiallyCorrect(questionInDb, questionToSave, onResolved);
                            break;
                        default:
                            onResolved({ question: questionToSave, type: QuestionSaveResolveType.Write });
                    }
                })
                .catch((reason) => reject(reason));
        });
    }

    private onStateIncorrectOrPartiallyCorrect(
        questionInDb: Question,
        questionToSave: Question,
        onResolved: (status: QuestionSaveResolveStatus) => void
    ) {
        switch (questionToSave.answer.state) {
            case QuestionState.incorrect:
                onResolved({ question: questionInDb, type: QuestionSaveResolveType.Ignore });
                break;
            case QuestionState.partiallycorrect:
                let merger: DbQuestionMerger = new DbQuestionMerger();
                let questionMerged: Question = merger.merge(questionInDb, questionToSave);
                onResolved({ question: questionMerged, type: QuestionSaveResolveType.Merge });
                break;
            default:
                onResolved({ question: questionToSave, type: QuestionSaveResolveType.Write });
        }
    }
}
