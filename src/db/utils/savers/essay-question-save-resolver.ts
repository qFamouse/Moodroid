import { QuestionSaveResolveType } from "~core/enums/question-save-resolve-type";
import { QuestionState } from "~core/enums/question-state";
import type { IQuestionSaveResolver } from "~core/interfaces/question-save-resolver";
import type { Question } from "~core/models/question";
import type { QuestionSaveResolveStatus } from "~core/types/question-save-resolve-status";
import { retrieveQuestion } from "../indexeddb";

export class EssayQuestionSaveResolver implements IQuestionSaveResolver {

  save(questionToSave: Question, questionKey: string): Promise<QuestionSaveResolveStatus> {
    return new Promise((resolve) => {
      console.debug("EssayQuestionSaveResolver", "save()", questionToSave, questionKey);

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
            this.onStateIncorrect(questionInDb, questionToSave, resolve);
            break;
          case QuestionState.partiallycorrect:
            this.onStatePartiallyCorrect(questionInDb, questionToSave, resolve);
            break;
        }
      });
    });
  }

  private onStateIncorrect(questionInDb: Question, questionToSave: Question, resolve: (status: QuestionSaveResolveStatus) => void) {
    switch (questionToSave.answer.state) {
      case QuestionState.correct:
      case QuestionState.partiallycorrect:
        resolve({question: questionToSave, type: QuestionSaveResolveType.Write});
        break;
      case QuestionState.incorrect:
        resolve({question: questionInDb, type: QuestionSaveResolveType.Ignore});
        break;
    }
  }

  private onStatePartiallyCorrect(questionInDb: Question, questionToSave: Question, resolve: (status: QuestionSaveResolveStatus) => void) {
    switch (questionToSave.answer.state) {
      case QuestionState.correct:
        resolve({question: questionToSave, type: QuestionSaveResolveType.Write});
        break;
      case QuestionState.partiallycorrect:
      case QuestionState.incorrect:
        resolve({question: questionInDb, type: QuestionSaveResolveType.Ignore});
        break;
    }
  }
}