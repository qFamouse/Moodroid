import type {IAnswerParser} from "~core/interfaces/answer-parser";
import type {EssayAnswer} from "~core/models/answers/essay-answer";
import {QuestionState} from "~core/enums/question-state";
import {parseQuestionState} from "~core/utils/parse/parse-question-state";

export class EssayParser implements IAnswerParser {
    parse(que: HTMLElement): EssayAnswer {
        let state : QuestionState = parseQuestionState(que);

        if (state != QuestionState.correct && state != QuestionState.partiallycorrect) {
            throw new Error("Save only the (partially)correct answers");
        }

        let answer : HTMLElement = que.querySelector(".answer");

        return {
            answer: answer.textContent
        }
    }
}