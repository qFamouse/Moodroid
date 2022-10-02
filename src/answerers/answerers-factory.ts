import {QuestionType} from "~models/QuestionType";
import type {IAnswerer} from "~core/interfaces/answerer";
import {MultichoiceAnswerer} from "~answerers/multichoice-answerer";
import {MatchAnswerer} from "~answerers/match-answerer";

export class AnswerersFactory {
    private static questionTypeAnswerer: Map<QuestionType, () => IAnswerer> = new Map<QuestionType, () => IAnswerer>([
        [QuestionType.multichoice, () => new MultichoiceAnswerer()],
        [QuestionType.match, () => new MatchAnswerer()]
    ]);

    public static getAnswerer(questionType: QuestionType) : IAnswerer | undefined {
        let constructor: () => IAnswerer = AnswerersFactory.questionTypeAnswerer.get(questionType);

        if (!constructor) return;

        return constructor();
    }
}
