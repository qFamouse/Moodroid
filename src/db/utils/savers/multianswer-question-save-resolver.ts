import { QuestionSaveResolveType } from "~core/enums/question-save-resolve-type";
import { QuestionState } from "~core/enums/question-state";
import type { IQuestionSaveResolver } from "~core/interfaces/question-save-resolver";
import type { Question } from "~core/models/question";
import type { QuestionSaveResolveStatus } from "~core/types/question-save-resolve-status";
import { retrieveQuestion } from "../indexeddb";
import { DbQuestionMerger } from "../mergers/db-question-merger";

export class MultianswerQuestionSaveResolver implements IQuestionSaveResolver {

  save(questionToSave: Question, questionKey: string): Promise<QuestionSaveResolveStatus> {
    return new Promise((resolve) => {
      console.debug("MultianswerQuestionSaveResolver", "save()", questionToSave, questionKey);

      retrieveQuestion(questionKey).then((questionInDb) => {
        if (!questionInDb) {
          resolve({question: questionToSave, type: QuestionSaveResolveType.Write});
          return;
        }

        switch (questionInDb.answer.state) {
          case QuestionState.correct:
            resolve({question: questionInDb, type: QuestionSaveResolveType.Ignore});
            break;
          case QuestionState.incorrect:
          case QuestionState.partiallycorrect:
            this.onStateIncorrectOrPartiallyCorrect(questionInDb, questionToSave, resolve);
            break;
        }
      });
    });
  }

  private onStateIncorrectOrPartiallyCorrect(questionInDb: Question, questionToSave: Question, resolve: (status: QuestionSaveResolveStatus) => void) {
    switch (questionToSave.answer.state) {
      case QuestionState.correct:
        resolve({question: questionToSave, type: QuestionSaveResolveType.Write});
        break;
      case QuestionState.incorrect:
        resolve({question: questionInDb, type: QuestionSaveResolveType.Ignore});
        break;
      case QuestionState.partiallycorrect:
        let merger: DbQuestionMerger = new DbQuestionMerger();
        let questionMerged: Question = merger.merge(questionInDb, questionToSave);
        resolve({question: questionMerged, type: QuestionSaveResolveType.Merge});
        break;
    }
  }
}