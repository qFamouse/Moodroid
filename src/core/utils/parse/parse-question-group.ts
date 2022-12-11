import { QuestionGroup } from "~core/enums/question-group";

export function parseQuestionGroup(que: HTMLElement): QuestionGroup {
    for (let token of que.classList) {
        switch (token) {
            case "correct":
            case "incorrect":
            case "partiallycorrect":
                return QuestionGroup.correctIncorrect;

            case "complete":
                return QuestionGroup.complete;
        }
    }

    throw new Error("I can't identify the group");
}
