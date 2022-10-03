import type {PlasmoContentScript} from "plasmo"
import {QuestionDatabase} from "~db/question-database";
import type {Question} from "~core/models/question";
import {QuestionParser} from "~core/parsers/question-parser";
import {generateQuestionKey} from "~core/utils/generate-question-key";

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/review.php*"]
}

window.addEventListener("load", async () => {


    let ques = document.querySelectorAll('.que') as NodeListOf<HTMLElement>;
    ques.forEach(que => {
        let question: Question = QuestionParser.parse(que);

        if (!question) {
            console.log("Can't parse");
        }

        console.log('Correct question', question);

        let key: string = generateQuestionKey(que);
        if (key && question) {
            QuestionDatabase.add(key, question);
        }

    })


    // if (await isVerifiedUser()) {
    //     let ques = document.querySelectorAll('.que') as NodeListOf<HTMLElement>
    //
    //     if (ques.length != 0) {
    //         ques.forEach(que => {
    //             let question : Question;
    //             if (QuizParser.isCorrectQuestion(que)) {
    //                 console.log('Correct question');
    //             }
    //             else {
    //
    //                 // TODO: check feedback to the right answer
    //                 console.log('Incorrect question');
    //             }
    //
    //             question = {
    //                 text: QuizParser.getQuestionText(que),
    //                 type: QuizParser.getQuestionType(que.classList),
    //                 correctAnswers: QuizParser.getCorrectAnswers(que),
    //                 incorrectAnswers: QuizParser.getIncorrectAnswers(que)
    //             }
    //
    //             console.log(question);
    //
    //             QuestionDatabase.add(
    //                 QuestionDatabase.generateKey(question.text, QuizParser.getQuestionImages(que)),
    //                 question);
    //         })
    //     }
    //     else {
    //         console.log(`Couldn't find the right questions`)
    //     }
    // }















    // ques.forEach(que => {
    //     // let parser : NewQuizParser = new NewQuizParser(que as HTMLElement);
    //
    //     let a = new NewQuizParser(que as HTMLElement);
    //
    //     console.log(QuizParser.getCorrectAnswers(que as HTMLElement));
    //
    //     // console.log(QuizParser.getQuestionAnswersAsElements(que));
    //
    //
    //
    //     return;
    //
    //     if (isCorrectQuestion(que)) {
    //         let type = QuizParser.getQuestionType(que.classList);
    //         let question : Question = {
    //             text: QuizParser.getQuestionText(que),
    //             type: type,
    //             answers: getCorrectAnswers(que, type)
    //         }
    //
    //         console.log(que.querySelectorAll("img"));
    //
    //         QuestionDatabase.add(squeezeText(question.text), question);
    //     }
    // })
})
