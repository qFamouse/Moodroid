import type {AnswerElement} from "~models/AnswerElement";

import {QuestionType} from "~models/QuestionType";

export class QuizParser {
    public static getQuestionAnswersAsElements(que : HTMLElement) : Array<AnswerElement> {
        let array = new Array<AnswerElement>();

        switch (this.getQuestionType(que.classList)) {
            case QuestionType.multichoice:
                this.getQuestionRows(que).forEach(row => {
                    array.push({
                        parent: row as HTMLElement,
                        text: row.querySelector('[data-region^=answer-label]').lastChild as HTMLElement,
                        input: row.querySelector("input[type=checkbox], input[type=radio]") as HTMLInputElement
                    })
                })
                break;

            case QuestionType.shortanswer:
            case QuestionType.essay:
                let parent = que.querySelector(".answer") as HTMLElement;
                parent.querySelectorAll(".answer>input,.answer>textarea").forEach(input => {
                    array.push({
                        parent: parent,
                        text: input as HTMLInputElement,
                        input: input as HTMLInputElement

                    })
                })
                break;

            case QuestionType.match:
                this.getQuestionRows(que).forEach(row => {
                    array.push({
                        parent: row as HTMLElement,
                        text: row.querySelector(".text"),
                        input: row.querySelector(".control")

                    })
                });
                break;

            default:
                throw new Error("Unsupported type");
        }

        return array;
    }

    public static hasRows(que : HTMLElement) : boolean {
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

    public static hasInput(que : HTMLElement) : boolean {
        return !this.hasRows(que);
    }

    public static isCorrectQuestion(que : HTMLElement) : boolean {
        if (!que.classList.contains(`correct`)) {
            let grade = que.querySelector('.grade')
            let parsedGrades = [...grade.textContent.matchAll(/\d[.,]\d+|\d+/g)];

            if (parsedGrades.length == 2) {
                if (parseFloat(parsedGrades[0][0]) != parseFloat(parsedGrades[1][0])) {
                    return false;
                }
            }
            else {
                throw new Error("The score parsing failed. There should be 2 grades")
            }
        }

        return true;
    }

    public static getQuestionImages(que : HTMLElement) : NodeListOf<HTMLImageElement> {
        return que.querySelectorAll(".qtext img")
    }

    public static getQuestionType(domTokenList : DOMTokenList) : QuestionType {
        for (let token of domTokenList) {
            if (token in QuestionType) {
                return QuestionType[token];
            }
        }

        throw new Error("Unknown question type")
    }

    public static getQuestionText(que : HTMLElement) : string {
        return que.querySelector('.qtext').textContent;
    }

    public static getQuestionRows(que : HTMLElement) : NodeListOf<HTMLElement> {
        if (this.hasRows(que)) {
            return que.querySelectorAll(".answer>[class^=r], tbody>[class^=r]");
        }
        else {
            throw new Error("This type cannot have rows");
        }
    }

    public static getCorrectAnswers(que : HTMLElement) : string[] {
        let correctAnswers : string[] = [];
        let answers = this.getQuestionAnswersAsElements(que);

        if (this.isCorrectQuestion(que)) {
            // It is assumed that the question is answered correctly and any marked/selected/written answer is correct.
            switch (this.getQuestionType(que.classList)) {
                case QuestionType.multichoice:
                    answers.forEach(answer => {
                        if (answer.input.checked) {
                            correctAnswers.push(answer.text.textContent)
                        }
                    })
                    break;

                case QuestionType.shortanswer:
                case QuestionType.essay:
                    answers.forEach(answer => {
                        correctAnswers.push(answer.input.value);
                    })
                    break;

                case QuestionType.match:
                    answers.forEach(answer => {
                        correctAnswers.push(answer.text.textContent); // text
                        correctAnswers.push(answer.input.querySelector("option:checked").textContent); // control
                    })
                    break;
            }
        }
        else {
            switch (this.getQuestionType(que.classList)) {
                case QuestionType.multichoice:
                    answers.forEach(answer => {
                        if (this.isCorrect(answer.parent)) {
                            correctAnswers.push(answer.text.textContent)
                        }
                    })
                    break;

                case QuestionType.match:
                    answers.forEach(answer => {
                        if (this.isCorrect(answer.input)) {
                            correctAnswers.push(answer.text.textContent); // text
                            correctAnswers.push(answer.input.querySelector("option:checked").textContent); // option
                        }
                    })
                    break;
            }
        }

        return correctAnswers;
    }

    public static getIncorrectAnswers(que : HTMLElement) : string[] {
        let incorrectAnswers : string[] = [];
        let answers = this.getQuestionAnswersAsElements(que);

        if (this.isCorrectQuestion(que)) {
            switch (this.getQuestionType(que.classList)) {
                case QuestionType.multichoice:
                    answers.forEach(answer => {
                        if (!answer.input.checked) {
                            incorrectAnswers.push(answer.text.textContent)
                        }
                    })
                    break;

                case QuestionType.match:
                    answers.forEach(answer => {
                        answer.input.querySelectorAll("option:not(:checked)").forEach(option => {
                            incorrectAnswers.push(answer.text.textContent); // text
                            incorrectAnswers.push(option.textContent); // option
                        })
                    })
                    break;
            }
        }
        else {
            switch (this.getQuestionType(que.classList)) {
                case QuestionType.multichoice:
                    answers.forEach(answer => {
                        if (this.isIncorrect(answer.parent)) {
                            if (answer.input.checked) {
                                incorrectAnswers.push(answer.text.textContent)
                            }
                        }
                    })
                    break;

                case QuestionType.match:
                    answers.forEach(answer => {
                        if (this.isIncorrect(answer.input)) {
                            incorrectAnswers.push(answer.text.textContent); // text
                            incorrectAnswers.push(answer.input.querySelector("option:checked").textContent); // option
                        }
                    })
                    break;
            }
        }

        return incorrectAnswers;
    }

    public static isIncorrect(element : HTMLElement) : boolean {
        if (element.classList.contains("incorrect") ||
            element.querySelector(".icon.fa.fa-remove.text-danger.fa-fw")) {
            return true;
        }

        return false;
    }

    public static isCorrect(element : HTMLElement) : boolean {
        if (element.classList.contains("correct") ||
            element.querySelector(".icon.fa.fa-check.text-success.fa-fw")) {
            return true;
        }

        return false;
    }
}
