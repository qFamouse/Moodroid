import type {AnswerElement} from "~models/AnswerElement";

import {QuestionType} from "~models/QuestionType";

export class QuizParser {
    private static hasRows(que : Element) : boolean {
        switch (this.getQuestionType(que.classList)) {
            case QuestionType.multichoice:
            case QuestionType.match:
                return true;
            case QuestionType.shortanswer:
            case QuestionType.essay:
                return false;
            default:
                throw new Error("Unsupported type");
        }
    }

    private static hasInput(que : Element) : boolean {
        return !this.hasRows(que);
    }

    public static getQuestionType(domTokenList : DOMTokenList) : QuestionType {
        for (let token of domTokenList) {
            if (token in QuestionType) {
                return QuestionType[token];
            }
        }

        throw new Error("Unknown question type")
    }

    public static getQuestionText(que : Element) : string {
        return que.querySelector('.qtext').textContent;
    }

    public static getQuestionRows(que : Element) : NodeListOf<Element> {
        if (this.hasRows(que)) {
            return que.querySelectorAll(".answer>[class^=r], tbody>[class^=r]");
        }
        else {
            throw new Error("This type cannot have rows");
        }
    }

    public static getMultichoiceElements(que : Element) : Array<HTMLElement> {
        if (QuizParser.getQuestionType(que.classList) == QuestionType.multichoice) {
            let multichoiceElements = new Array<HTMLElement>()
            this.getQuestionRows(que).forEach(row => {
                multichoiceElements.push(row.querySelector('[data-region^=answer-label]').lastChild as HTMLElement);
            })
            return multichoiceElements;
        }

        throw new Error("Unsupported type");
    }

    public static getQuestionTextFromRow(row : Element) {
        if (new RegExp("\\br\\d+\\b").test(row.classList.value)) {
            return row.querySelector('[data-region^=answer-label],.text').lastChild.textContent
        }
    }

    public static getMatchElements(que : Element) : Array<MatchElement> {
        if (QuizParser.getQuestionType(que.classList) == QuestionType.match) {
            let matchElements = new Array<MatchElement>()
            this.getQuestionRows(que).forEach(row => {
                let matchQuestion = new MatchElement(
                    row.querySelector(".text"),
                    row.querySelector(".control")
                );

                matchElements.push(matchQuestion);
            });

            return matchElements;
        }

        throw new Error("Unsupported type");
    }

    public static getQuestionInput(que : Element) : HTMLInputElement {
        if (this.hasInput(que)) {
            return que.querySelector(".answer>input,.answer>textarea") as HTMLInputElement;
        }
        else {
            throw new Error("This type cannot have input element");
        }
    }
}
