import { QuestionState } from "~core/enums/question-state";
import type { IAnswerer } from "~core/interfaces/answerer";
import type { MatchAnswer } from "~core/models/answers/match-answer";
import type { Question } from "~core/models/question";

interface IMatchAction {
    (option: HTMLOptionElement): void;
}

export class MatchAnswerer implements IAnswerer {
    private enumerator(
        que: HTMLElement,
        question: Question,
        correctAction: IMatchAction = undefined,
        incorrectAction: IMatchAction = undefined
    ): void {
        let matchAnswer = question.answer as MatchAnswer;
        let rows: NodeListOf<HTMLElement> = que.querySelectorAll("tbody>[class^=r]");

        rows.forEach((row) => {
            let answerText: string = row.querySelector(".text").textContent;
            let answer = matchAnswer.answers[answerText];
            if (answer) {
                let options: NodeListOf<HTMLOptionElement> = row.querySelectorAll(".control>select>option");

                if (correctAction) {
                    let correctOption = Array.from(options).find((option) => option.textContent == answer.correctAnswer);
                    if (correctOption) {
                        correctAction(correctOption);
                    }
                }

                if (incorrectAction) {
                    answer.incorrectAnswers.forEach((incorrectAnswer) => {
                        let incorrectOption = Array.from(options).find((option) => option.textContent == incorrectAnswer);
                        if (incorrectOption) {
                            incorrectAction(incorrectOption);
                        }
                    });
                }
            }
        });
    }

    adventure(que: HTMLElement, question: Question) {
        let correctAction: IMatchAction = (option: HTMLOptionElement) => {
            option.style.color = "#fff800";
            option.style.background = "#3aa83a";
        };

        let incorrectAction: IMatchAction = (option: HTMLOptionElement) => {
            option.style.color = "#fff800";
            option.style.background = "#b90000";
        };

        this.enumerator(que, question, correctAction, incorrectAction);
    }

    exam(que: HTMLElement, question: Question) {
        let correctAction: IMatchAction = (option: HTMLOptionElement) => {
            option.style.fontStyle = "italic";
        };

        this.enumerator(que, question, correctAction);
    }

    hack(que: HTMLElement, question: Question) {
        let correctAction: IMatchAction = (option: HTMLOptionElement) => {
            option.selected = true;
        };

        this.enumerator(que, question, correctAction);
    }

    roll(que: HTMLElement, question: Question) {
        let matchAnswer = question?.answer as MatchAnswer;

        if (matchAnswer && Object.keys(matchAnswer.answers).length > 0 && matchAnswer.state === QuestionState.correct) {
            return this.hack(que, question);
        }

        let rows: NodeListOf<HTMLElement> = que.querySelectorAll("tbody>[class^=r]");
        let optionsLength = rows[0]?.querySelectorAll(".control>select>option").length - 1; // -1 because we don't need the first option (its "Choose...")
        let optionsIndexes = Array.from({ length: optionsLength }, (_, i) => i + 1); //=> [1, 2, 3, 4, ... optionLength]

        while (optionsLength < rows.length) {
            optionsIndexes.push(optionsIndexes[Math.floor(Math.random() * optionsIndexes.length)]);
        }

        // Shuffle
        optionsIndexes = optionsIndexes.sort((a, b) => 0.5 - Math.random());

        rows.forEach((row) => {
            let options: NodeListOf<HTMLOptionElement> = row.querySelectorAll(".control>select>option");
            let idx = optionsIndexes.pop();
            options[idx].selected = true;
        });
    }
}
