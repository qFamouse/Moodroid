import {QuestionType} from "~models/QuestionType";
import type {IAnswerer} from "~core/interfaces/answerer";
import {MultichoiceAnswerer} from "~answerers/multichoice-answerer";
import {MatchAnswerer} from "~answerers/match-answerer";
import {ShortanswerAnswerer} from "~answerers/shortanswer-answerer";
import {EssayAnswerer} from "~answerers/essay-answerer";

export class AnswerersFactory {
    private static questionTypeAnswerer: Map<QuestionType, () => IAnswerer> = new Map<QuestionType, () => IAnswerer>([
        [QuestionType.multichoice, () => new MultichoiceAnswerer()],
        [QuestionType.match, () => new MatchAnswerer()],
        [QuestionType.shortanswer, () => new ShortanswerAnswerer()],
        [QuestionType.essay, () => new EssayAnswerer()]
    ]);

    public static getAnswerer(questionType: QuestionType) : IAnswerer | undefined {
        let constructor: () => IAnswerer = AnswerersFactory.questionTypeAnswerer.get(questionType);

        if (!constructor) return;

        return constructor();
    }
}
