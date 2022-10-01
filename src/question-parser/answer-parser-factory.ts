import {QuestionType} from "~models/QuestionType";
import type {IAnswerParser} from "~core/interfaces/answer-parser";
import {MultichoiceParser} from "~question-parser/parsers/multichoice-parser";
import {MatchParser} from "~question-parser/parsers/match-parser";

export class AnswerParserFactory {

    private static questionTypeAnswerParser: Map<QuestionType, () => IAnswerParser> = new Map<QuestionType, () => IAnswerParser>([
        [QuestionType.multichoice, () => new MultichoiceParser()],
        [QuestionType.match, () => new MatchParser()]
    ]);

    static getAnswerParser(questionType: QuestionType): IAnswerParser | undefined {
        let constructor: () => IAnswerParser = AnswerParserFactory.questionTypeAnswerParser.get(questionType);

        if (!constructor) return;

        return constructor();
    }
}
