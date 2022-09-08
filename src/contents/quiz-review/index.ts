import type { PlasmoContentScript } from "plasmo"

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/review.php*"]
}

enum QuestionType {
    multichoice = "multichoice", // radio & checkbox
    match       = "match",       // select

    shortanswer = "shortanswer", // small input
    multianswer = "multianswer", // in practice, I have not met. Has been founded in the source files. When applied, this class slightly increases the 'shortanswer'
    rightanswer = "rightanswer", // in practice, I have not met. Has been founded in the source files. When applied, this class slightly increases the 'shortanswer'
    essay       = "essay",       // textarea

}

declare type Question = {
    text: string,
    type: QuestionType,
    answers: string[]
};

window.addEventListener("load", () => {
    // let que = document.getElementsByClassName('que complete correct')
    let que = document.querySelectorAll('.que:not(.incorrect),.que.correct')

    if (!que[0]) {
        return;
    }

    if (!que[0].classList.contains(`correct`)) {
        let grade = que[0].querySelector('.grade')
        let parsedGrades = [...grade.textContent.matchAll(/\d[.,]\d+|\d+/g)];

        if (parsedGrades.length == 2) {
            if (parseFloat(parsedGrades[0][0]) != parseFloat(parsedGrades[1][0])) {
                // вопрос является проваленым
            }
        }
        else {
            throw new Error("The score parsing failed. There should be 2 grades")
        }
    }
    // after this point, the answer is considered correct
    // console.log(question.type)

    // question.questionText = que[0].querySelector('.qtext').textContent


    que[0].classList.forEach(curClass => {
        if (curClass in QuestionType) {
            console.log('is ', curClass);
        }
    });

    let answer = que[0].querySelector('.answer');

    if (answer) {
        // if type radio checkbox
        let correct = answer.querySelectorAll("[class^=r].correct, [class^=r]:has(input:checked)");
        correct.forEach(cor => {

            console.log(cor.querySelector(".flex-fill.ml-1").textContent)
        })

        // if type shortanswer textarea
        // console.log((answer.querySelector("input,textarea") as HTMLInputElement).value);

        // if type match
        answer.querySelectorAll("[class^=r]").forEach(r => {
            let matchText = r.querySelector(".text").textContent;

            console.log(r.querySelector("option:checked").textContent);
        });
    }


    // let correct = que[0].querySelector('.r0.correct');

    // console.log(correct.textContent);



})
