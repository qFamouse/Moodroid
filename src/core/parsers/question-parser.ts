import {Question} from "~core/models/question";
import {parseQuestionType} from "~core/utils/parse/parse-question-type";
import {parseQuestionText} from "~core/utils/parse/parse-question-text";
import type {IAnswer} from "~core/interfaces/answer";
import {AnswerParserFactory} from "~core/utils/answer-parser-factory";
import {parseQuestionState} from "~core/utils/parse/parse-question-state";
import {QuestionState} from "~core/enums/question-state";
import type {QuestionType} from "~core/enums/question-type";


export class QuestionParser {
    static parse(que: HTMLElement): Question {
        if (!this.canParse(que)) throw new Error("Can't parse this question state: " + parseQuestionState(que))

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
            || state === QuestionState.partiallycorrect
            || state === QuestionState.incorrect;
    }
}
