import {QuestionType} from "~core/enums/question-type";
import type {IAnswerer} from "~core/interfaces/answerer";
import {MultichoiceAnswerer} from "~core/answerers/multichoice-answerer";
import {MatchAnswerer} from "~core/answerers/match-answerer";
import {ShortanswerAnswerer} from "~core/answerers/shortanswer-answerer";
import {EssayAnswerer} from "~core/answerers/essay-answerer";
import {MultianswerAnswerer} from "~core/answerers/multianswer-answerer";

export class AnswerersFactory {
    private static questionTypeAnswerer: Map<QuestionType, () => IAnswerer> = new Map<QuestionType, () => IAnswerer>([
        [QuestionType.multichoice, () => new MultichoiceAnswerer()],
        [QuestionType.match, () => new MatchAnswerer()],
        [QuestionType.shortanswer, () => new ShortanswerAnswerer()],
        [QuestionType.essay, () => new EssayAnswerer()],
        [QuestionType.multianswer, () => new MultianswerAnswerer()]
    ]);

    public static getAnswerer(questionType: QuestionType) : IAnswerer | undefined {
        let constructor: () => IAnswerer = AnswerersFactory.questionTypeAnswerer.get(questionType);

        if (!constructor) return;

        return constructor();
    }
}
