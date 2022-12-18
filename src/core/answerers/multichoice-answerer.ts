import type { IAnswerer } from "~core/interfaces/answerer";
import type { MultichoiceAnswer } from "~core/models/answers/multichoice-answer";
import type { Question } from "~core/models/question";

interface IMultichoiceAction {
    (input: HTMLInputElement, answerLabel: HTMLElement): void;
}

export class MultichoiceAnswerer implements IAnswerer {
    private enumerator(
        que: HTMLElement,
        question: Question,
        correctAction: IMultichoiceAction = () => {},
        incorrectAction: IMultichoiceAction = () => {}
    ): void {
        let answer = question.answer as MultichoiceAnswer;
        let rows = que.querySelectorAll(".answer>[class^=r]");

        rows.forEach((row) => {
            let input: HTMLInputElement = row.querySelector("input[type=radio], input[type=checkbox]");
            let answerLabel: HTMLLabelElement = row.querySelector("[data-region^=answer-label]>:last-child");

            let index = answer.correctAnswers.indexOf(answerLabel.textContent);
            if (index >= 0) {
                correctAction(input, answerLabel);
                return;
            }

            index = answer.incorrectAnswers.indexOf(answerLabel.textContent);
            if (index >= 0) {
                incorrectAction(input, answerLabel);
                return;
            }
        });
    }

    public hack(que: HTMLElement, question: Question): void {
        let correctAction: IMultichoiceAction = (input: HTMLInputElement, answerLabel: HTMLElement) => {
            input.checked = true;
        };

        this.enumerator(que, question, correctAction);
    }

    public adventure(que: HTMLElement, question: Question): void {
        let correctAction: IMultichoiceAction = (input: HTMLInputElement, answerLabel: HTMLElement) => {
            answerLabel.style.color = "#fff800";
            answerLabel.style.background = "#3aa83a";
        };

        let incorrectAction: IMultichoiceAction = (input: HTMLInputElement, answerLabel: HTMLElement) => {
            answerLabel.style.color = "#ffffff";
            answerLabel.style.background = "#b90000";
        };

        this.enumerator(que, question, correctAction, incorrectAction);
    }

    public exam(que: HTMLElement, question: Question): void {
        // Adding html point for advises
        let createStatusPoint = (): HTMLDivElement => {
            let statusPoint = document.createElement("div");
            statusPoint.innerHTML = "•";
            statusPoint.style.position = "absolute";
            statusPoint.style.fontSize = "20px";
            statusPoint.style.color = "#000000";
            statusPoint.style.display = "none";
            return statusPoint;
        };

        // Create points
        let bellIcon: HTMLElement = document.querySelector(".icon.fa.fa-bell.fa-fw");
        let correctPoint : HTMLDivElement = createStatusPoint();

        let messageIcon: HTMLElement = document.querySelector(".icon.fa.fa-comment.fa-fw");
        let incorrectPoint : HTMLDivElement = createStatusPoint();

        if (bellIcon && messageIcon) {
            correctPoint.style.inset = incorrectPoint.style.inset = "0 0 0 0";

            bellIcon.style.position = messageIcon.style.position = "relative";
            bellIcon.appendChild(correctPoint);
            messageIcon.appendChild(incorrectPoint);
        }
        else {
            correctPoint.style.bottom = incorrectPoint.style.bottom = "20px";
            correctPoint.style.left = incorrectPoint.style.right = "20px";

            document.body.append(correctPoint, incorrectPoint);
        }

        // Generate events for tips
        let correctAction: IMultichoiceAction = (input: HTMLInputElement, answerLabel: HTMLElement) => {
            answerLabel.addEventListener("mouseover", (event) => {
                correctPoint.style.display = "block";
            });
            answerLabel.addEventListener("mouseout", (event) => {
                correctPoint.style.display = "none";
            });
        };

        let incorrectAction: IMultichoiceAction = (input: HTMLInputElement, answerLabel: HTMLElement) => {
            answerLabel.addEventListener("mouseover", (event) => {
                incorrectPoint.style.display = "block";
            });
            answerLabel.addEventListener("mouseout", (event) => {
                incorrectPoint.style.display = "none";
            });
        };

        this.enumerator(que, question, correctAction, incorrectAction);
    }
}
