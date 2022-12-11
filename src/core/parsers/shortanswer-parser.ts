import { QuestionState } from "~core/enums/question-state"
import type { IAnswerParser } from "~core/interfaces/answer-parser"
import type { ShortanswerAnswer } from "~core/models/answers/shortanswer-answer"
import { parseQuestionState } from "~core/utils/parse/parse-question-state"

export class ShortanswerParser implements IAnswerParser {
    parse(que: HTMLElement): ShortanswerAnswer {
        let state: QuestionState = parseQuestionState(que)

        if (state != QuestionState.correct) {
            throw new Error("Save only the correct answers")
        }

        let input: HTMLInputElement = que.querySelector(".answer>input")

        return {
            answer: input.value,
            state: state
        }
    }
}
