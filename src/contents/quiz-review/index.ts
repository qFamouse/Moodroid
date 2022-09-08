import type {PlasmoContentScript} from "plasmo"
import {Question, QuestionType} from "~models/Question";
import {QuizParser} from "~models/QuizParser";

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/review.php*"]
}

function isCorrectQuestion(que : Element) {
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


window.addEventListener("load", () => {
    let ques = document.querySelectorAll('.que:not(.incorrect),.que.correct')

    ques.forEach(que => {
        if (isCorrectQuestion(que)) {
            let type = QuizParser.getQuestionType(que.classList);
            let question : Question = {
                text: QuizParser.getQuestionText(que),
                type: type,
                answers: getCorrectAnswers(que, type)
            }

            console.log(question);
        }
    })


    // que[0].classList.forEach(curClass => {
    //     if (curClass in QuestionType) {
    //         console.log('is ', curClass);
    //
    //     }
    // });
    //
    // let answer = que[0].querySelector(".answer");
    //
    // console.log(getAnswers(answer, QuestionType.multichoice));
})

function getCorrectAnswers(que : Element, type : QuestionType) : string[] {
    let answers : string[] = [];

    switch (type) {
        case QuestionType.multichoice: // radio & checkbox
            que.querySelectorAll(".answer>[class^=r].correct, .answer>[class^=r]:has(input:checked)")
                .forEach(r => {
                   answers.push(r.querySelector(".flex-fill.ml-1").textContent)
                });
            break;

        case QuestionType.shortanswer: // input & textarea
        case QuestionType.multianswer:
        case QuestionType.rightanswer:
        case QuestionType.essay:
            answers.push((que.querySelector(".answer>input,.answer>textarea") as HTMLInputElement).value)
            break;

        case QuestionType.match:
            que.querySelectorAll(".answer>[class^=r]").forEach(r => {
                answers.push(r.querySelector(".text").textContent); // text
                answers.push(r.querySelector("option:checked").textContent) // control
            });
    }

    return answers;
}
