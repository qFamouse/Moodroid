import {QuestionType} from "~core/enums/QuestionType";

export function parseQuestionType(que: HTMLElement) : QuestionType {
    let classList: DOMTokenList = que.classList;
    for (let token of classList) {
        if (token in QuestionType) {
            return QuestionType[token];
        }
    }
    throw new Error("Unknown question type");
}
