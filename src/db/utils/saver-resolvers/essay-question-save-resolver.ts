import { QuestionSaveResolveType } from "~core/enums/question-save-resolve-type";
import { QuestionState } from "~core/enums/question-state";
import type { IQuestionSaveResolver } from "~core/interfaces/question-save-resolver";
import type { Question } from "~core/models/question";
import type { QuestionSaveResolveStatus } from "~core/types/question-save-resolve-status";

import { retrieveQuestion } from "../indexeddb";

export class EssayQuestionSaveResolver implements IQuestionSaveResolver {
    resolve(questionToSave: Question, questionKey: string): Promise<QuestionSaveResolveStatus> {
        return new Promise((onResolved, reject) => {
            console.debug("EssayQuestionSaveResolver", "resolve()", questionToSave, questionKey);

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
                return this.ignoreAndWriteCorrect(questionInDb, questionToSave);
            case QuestionState.explicit:
                return this.writeAndIgnoreIncorrect(questionInDb, questionToSave);
            case QuestionState.incorrect:
                return this.writeAndIngoreExplicitOrIncorrect(questionInDb, questionToSave);
            default:
                return { question: questionInDb, type: QuestionSaveResolveType.Ignore };
        }
    }

    private ignoreAndWriteCorrect(questionInDb: Question, questionToSave: Question): QuestionSaveResolveStatus {
        switch (questionToSave.answer.state) {
            case QuestionState.correct:
                return { question: questionToSave, type: QuestionSaveResolveType.Write };
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

    private writeAndIngoreExplicitOrIncorrect(questionInDb: Question, questionToSave: Question): QuestionSaveResolveStatus {
        switch (questionToSave.answer.state) {
            case QuestionState.explicit:
            case QuestionState.incorrect:
                return { question: questionInDb, type: QuestionSaveResolveType.Ignore };
            default:
                return { question: questionToSave, type: QuestionSaveResolveType.Write };
        }
    }
}
