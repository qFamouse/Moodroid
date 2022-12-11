import { QuestionState } from "~core/enums/question-state"

export function parseQuestionState(que: HTMLElement): QuestionState {
    // Stage 1 - Parse by class names
    let domTokenList = que.classList
    for (let token of domTokenList) {
        if (token in QuestionState) {
            return QuestionState[token]
        }
    }

    // Stage 2 - else Parse by 2 marks
    let gradeElement: HTMLElement = que.querySelector(".grade")
    if (gradeElement) {
        let gradeText = gradeElement.textContent.replaceAll(",", ".")
        let matchAllNumbers = gradeText.match(/\d[.]\d+|\d+/g)
        let marks = Array.from(matchAllNumbers)
        if (marks.length == 2) {
            let leftMark = parseFloat(marks[0])
            let rightMark = parseFloat(marks[1])
            if (leftMark == rightMark) {
                // Mark 0.00 out of 1.00
                return QuestionState.correct
            } else if (rightMark - leftMark != rightMark) {
                // Mark 0.50 out of 1.00
                return QuestionState.partiallycorrect
            } else {
                // Mark 0.00 out of 1.00
                return QuestionState.incorrect
            }
        } else {
            // Stage 3* - else Parse by any count of marks
            // Such situations have not yet been encountered
            console.warn("Untreated Situation Stage 3")
        }
    }

    // Stage 4 - I have no idea what the structure of the question is
    throw new Error(`parseToQuestionState: unknown question structure. ${que}`)
}
