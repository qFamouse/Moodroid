import type {IAnswerer} from "~core/interfaces/answerer";
import type {Question} from "~core/models/Question";
import type {MatchAnswer} from "~core/models/answers/match-answer";

export class MatchAnswerer implements IAnswerer {
    answer(que: HTMLElement, question: Question) {
        let answer = question.answer as MatchAnswer;
        let rows : NodeListOf<HTMLElement> = que.querySelectorAll("tbody>[class^=r]");

        rows.forEach(row => {
            let answerText : string = row.querySelector(".text").textContent;
            let correctAnswer = answer.answers[answerText];
            if (correctAnswer) {
                let options : NodeListOf<HTMLOptionElement> = row.querySelectorAll(".control>select>option");
                let correctOption = Array.from(options).find(option => option.textContent == correctAnswer.correctAnswer);
                correctOption.selected = true;
            }
        });

    }
}
