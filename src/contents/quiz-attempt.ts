import type { PlasmoContentScript } from "plasmo"
import { QuestionDatabase } from "~utils/QuestionDatabase";
import { isVerifiedUser } from "~utils/isVerifiedUser";
import { QuestionsUtil } from "~utils/QuestionsUtil";
import type { QuestionType } from "~models/QuestionType";
import type { IAnswerer } from "~answerers/IAnswerer";
import { AnswerersFactory } from "~utils/AnswerersFactory";

export const config: PlasmoContentScript = {
  matches: ["*://newsdo.vsu.by/mod/quiz/attempt.php*"]
}

window.addEventListener("load", async () => {
  if (await isVerifiedUser()) {
    let ques = document.querySelectorAll('.que') as NodeListOf<HTMLElement>;

    ques.forEach(que => {
      let key: string = QuestionsUtil.generateQuestionKey(que);

      QuestionDatabase.get(key).then(question => {
          if (!question) {
            console.log("Not found", key);
            return;
          }

          let answerer: IAnswerer = AnswerersFactory.getAnswerer(question.type);

          if (!answerer) {
            console.log("Answerer not found", question.type);
            return;
          }

          answerer.answer(que, question);
      });
    });
  }
});

