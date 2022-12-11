import { QuestionType } from "~core/enums/question-type";
import type { IQuestionSaveResolver } from "~core/interfaces/question-save-resolver";

import { EssayQuestionSaveResolver } from "./essay-question-save-resolver";
import { MatchQuestionSaveResolver } from "./match-question-save-resolver";
import { MultianswerQuestionSaveResolver } from "./multianswer-question-save-resolver";
import { MultichoiseQuestionSaveResolver } from "./multichoise-question-save-resolver";
import { ShortanswerQuestionSaveResolver } from "./shortanswer-question-save-resolver";

export class QuestionSaveResolverFactory {
    private static typeSaver = new Map<QuestionType, () => IQuestionSaveResolver>([
        [QuestionType.multichoice, () => new MultichoiseQuestionSaveResolver()],
        [QuestionType.match, () => new MatchQuestionSaveResolver()],
        [QuestionType.shortanswer, () => new ShortanswerQuestionSaveResolver()],
        [QuestionType.essay, () => new EssayQuestionSaveResolver()],
        [QuestionType.multianswer, () => new MultianswerQuestionSaveResolver()]
    ]);

    static getQuestionSaver(questionType: QuestionType): IQuestionSaveResolver | undefined {
        let constructor: () => IQuestionSaveResolver = QuestionSaveResolverFactory.typeSaver.get(questionType);

        if (!constructor) return;

        return constructor();
    }
}
