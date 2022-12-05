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

      retrieveQuestion(questionKey).then((questionInDb) => {
        if (!questionInDb) {
          onResolved({question: questionToSave, type: QuestionSaveResolveType.Write});
          return;
        }

        switch (questionInDb.answer.state) {
          case QuestionState.correct:
            onResolved({question: questionInDb, type: QuestionSaveResolveType.Ignore});
            break;
          case QuestionState.incorrect:
            this.onStateIncorrect(questionInDb, questionToSave, onResolved);
            break;
          case QuestionState.partiallycorrect:
            this.onStatePartiallyCorrect(questionInDb, questionToSave, onResolved);
            break;
          default:
            onResolved({question: questionToSave, type: QuestionSaveResolveType.Write});
        }
      })
      .catch((reason) => reject(reason));
    });
  }

  private onStateIncorrect(questionInDb: Question, questionToSave: Question, onResolved: (status: QuestionSaveResolveStatus) => void) {
    switch (questionToSave.answer.state) {
      case QuestionState.incorrect:
        onResolved({question: questionInDb, type: QuestionSaveResolveType.Ignore});
        break;
      default:
        onResolved({question: questionToSave, type: QuestionSaveResolveType.Write});
    }
  }

  private onStatePartiallyCorrect(questionInDb: Question, questionToSave: Question, onResolved: (status: QuestionSaveResolveStatus) => void) {
    switch (questionToSave.answer.state) {
      case QuestionState.partiallycorrect:
      case QuestionState.incorrect:
        onResolved({question: questionInDb, type: QuestionSaveResolveType.Ignore});
        break;
      default:
        onResolved({question: questionToSave, type: QuestionSaveResolveType.Write});
    }
  }
}