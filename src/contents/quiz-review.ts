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
    ques.forEach((que, i) => {

        try {
            let question : Question = QuestionParser.parse(que);

            if (!question) {
                console.log("Can't parse");
                return;
            }

            console.log('Parsed question', question);

            let key = generateQuestionKey(que);
            QuestionDatabase.add(key, question);
        }
        catch (e) {
            console.warn(e, i+1)
        }
    })
})
