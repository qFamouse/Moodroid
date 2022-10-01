import type {IAnswerParser} from "~core/interfaces/answer-parser";
import type {EsseyAnswer} from "~core/models/answers/essey-answer";
import {QuestionState} from "~core/models/QuestionState";
import {parseQuestionState} from "~question-parser/shared/parse-question-state";

export class EsseyParser implements IAnswerParser {
    parse(que: HTMLElement): EsseyAnswer {
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
