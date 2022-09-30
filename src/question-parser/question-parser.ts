import {Question} from "~models/Question";
import {parseQuestionType} from "~question-parser/shared/parse-question-type";
import {parseQuestionText} from "~question-parser/shared/parse-question-text";
import type {IAnswer} from "~core/interfaces/answer";
import {AnswerParserFactory} from "~question-parser/answer-parser-factory";
import {parseQuestionState} from "~question-parser/shared/parse-question-state";
import {QuestionState} from "~core/models/QuestionState";
import type {QuestionType} from "~models/QuestionType";


export class QuestionParser {
    static parse(que: HTMLElement): Question {
        if (!QuestionParser.canParse(que)) return;

        let type: QuestionType = parseQuestionType(que);
        let text: string = parseQuestionText(que);
        let answer: IAnswer = AnswerParserFactory.getAnswerParser(type)?.parse(que);

        if (type && text && answer) {
            return new Question(text, type, answer);
        }
    }

    private static canParse(que: HTMLElement): boolean {
        let state: QuestionState = parseQuestionState(que);
        return state === QuestionState.correct
            || state === QuestionState.partiallycorrect;
    }
}
