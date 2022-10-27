import { QuestionType } from "~core/enums/question-type"
import type { IAnswerParser } from "~core/interfaces/answer-parser"
import { EssayParser } from "~core/parsers/essay-parser"
import { MatchParser } from "~core/parsers/match-parser"
import { MultianswerParser } from "~core/parsers/multianswer-parser"
import { MultichoiceParser } from "~core/parsers/multichoice-parser"
import { ShortanswerParser } from "~core/parsers/shortanswer-parser"

export class AnswerParserFactory {
    private static questionTypeAnswerParser: Map<
        QuestionType,
        () => IAnswerParser
    > = new Map<QuestionType, () => IAnswerParser>([
        [QuestionType.multichoice, () => new MultichoiceParser()],
        [QuestionType.match, () => new MatchParser()],
        [QuestionType.shortanswer, () => new ShortanswerParser()],
        [QuestionType.essay, () => new EssayParser()],
        [QuestionType.multianswer, () => new MultianswerParser()]
    ])

    static getAnswerParser(
        questionType: QuestionType
    ): IAnswerParser | undefined {
        let constructor: () => IAnswerParser =
            AnswerParserFactory.questionTypeAnswerParser.get(questionType)

        if (!constructor) return

        return constructor()
    }
}
