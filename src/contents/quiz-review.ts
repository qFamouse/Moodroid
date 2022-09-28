import type { PlasmoContentScript } from "plasmo"
import { QuestionDatabase } from "~utils/QuestionDatabase";
import type { Question } from "~models/Question";
import { isVerifiedUser } from "~utils/isVerifiedUser";
import { QuestionParser } from "~parsers/QuestionParser";
import { QuestionsUtil } from "~utils/QuestionsUtil";

export const config: PlasmoContentScript = {
  matches: ["*://newsdo.vsu.by/mod/quiz/review.php*"]
}

window.addEventListener("load", async () => {
  if (await isVerifiedUser()) {
    let ques = document.querySelectorAll('.que') as NodeListOf<HTMLElement>

    if (!ques.length) {
      console.log("No questions found for review");
      return;
    }
    
    ques.forEach(que => {
      let question: Question = QuestionParser.parse(que);
      
      if (!question) {
        console.log("Can't parse");
        return;
      }

      console.log('Correct question', question);
      let key: string = QuestionsUtil.generateQuestionKey(que);
      if (key && question) {
        QuestionDatabase.add(key, question);
      }
    });
  }
});