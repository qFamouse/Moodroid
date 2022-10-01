import {QuestionType} from "~models/QuestionType";
import type {IAnswerParser} from "~core/interfaces/answer-parser";
import {MultichoiceParser} from "~question-parser/parsers/multichoice-parser";
import {MatchParser} from "~question-parser/parsers/match-parser";
import {ShortanswerParser} from "~question-parser/parsers/shortanswer-parser";
import {EsseyParser} from "~question-parser/parsers/essey-parser";
import {MultianswerParser} from "~question-parser/parsers/multianswer-parser";

export class AnswerParserFactory {

    private static questionTypeAnswerParser: Map<QuestionType, () => IAnswerParser> = new Map<QuestionType, () => IAnswerParser>([
        [QuestionType.multichoice, () => new MultichoiceParser()],
        [QuestionType.match, () => new MatchParser()],
        [QuestionType.shortanswer, () => new ShortanswerParser()],
        [QuestionType.essay, () => new EsseyParser()],
        [QuestionType.multianswer, () => new MultianswerParser()]
    ]);

    static getAnswerParser(questionType: QuestionType): IAnswerParser | undefined {
        let constructor: () => IAnswerParser = AnswerParserFactory.questionTypeAnswerParser.get(questionType);

        if (!constructor) return;

        return constructor();
    }
}
