import type { IAnswerer } from "~core/interfaces/answerer"
import type { MultianswerAnswer } from "~core/models/answers/multianswer-answer"
import type { Question } from "~core/models/question"

export class MultianswerAnswerer implements IAnswerer {
    answer(que: HTMLElement, question: Question) {
        let answer = question.answer as MultianswerAnswer
        let answerContainer: HTMLElement = que.querySelector(
            "input[type=hidden]+p+p"
        )
        let inputs: NodeListOf<HTMLInputElement> =
            answerContainer.querySelectorAll("input")

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = answer.answers[i]
        }
    }
}
