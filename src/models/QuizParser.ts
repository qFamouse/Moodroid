import {QuestionType} from "~models/Question";

export class QuizParser {


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

    public static getQuestionResponses(que : Element) : NodeListOf<Element> {
        return que.querySelectorAll(".answer>[class^=r],.answer>input,.answer>textarea");
    }
}
