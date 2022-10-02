import type {IAnswerParser} from "~core/interfaces/answer-parser";
import type {EssayAnswer} from "~core/models/answers/essay-answer";
import {QuestionState} from "~core/models/QuestionState";
import {parseQuestionState} from "~question-parser/shared/parse-question-state";

export class EssayParser implements IAnswerParser {
    parse(que: HTMLElement): EssayAnswer {
        let state : QuestionState = parseQuestionState(que);

        if (state != QuestionState.correct && state != QuestionState.partiallycorrect) {
            throw new Error("Save only the (partially)correct answers");
        }

        let textarea : HTMLTextAreaElement = que.querySelector(".answer>textarea");

        return {
            answer: textarea.value
        }
    }
}
