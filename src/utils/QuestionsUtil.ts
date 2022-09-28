import { QuestionState } from "~models/QuestionState";
import { QuestionType } from "~models/QuestionType";
import { squeezeText } from "./squeezeText";

export class QuestionsUtil {

  static getQuestionType(que: HTMLElement): QuestionType {
    let classList: DOMTokenList = que.classList;
    for (let token of classList) {
      if (token in QuestionType) {
        return QuestionType[token];
      }
    }
    throw new Error("Unknown question type");
  }

  static getQuestionState(que: HTMLElement): QuestionState {

    // Stage 1 - Parse by class names
    let domTokenList = que.classList;
    for (let token of domTokenList) {
      if (token in QuestionState) {
        return QuestionState[token];
      }
    }

    // Stage 2 - else Parse by 2 marks
    let gradeElement : HTMLElement = que.querySelector('.grade');
    if (gradeElement) {
      let matchAllNumbers = gradeElement.textContent.match(/\d[.,]\d+|\d+/g);
      let marks = Array.from(matchAllNumbers);
      if (marks.length == 2) {
        let leftMark = parseFloat(marks[0]);
        let rightMark = parseFloat(marks[1]);

        if (leftMark == rightMark) { // Mark 0.00 out of 1.00
          return QuestionState.correct;
        }
        else if (rightMark - leftMark != rightMark) { // Mark 0.50 out of 1.00
          return QuestionState.partiallycorrect;
        }
        else { // Mark 0.00 out of 1.00
          return QuestionState.incorrect
        }
      } else { // Stage 3 - else Parse by any count of marks
        // TODO: Use AnswerParser to check state
      }
    }

    // Stage 4 - I have no idea what the structure of the question is
    throw new Error(`parseToQuestionState: unknown question structure. ${que}`);
  }

  static generateQuestionKey(que: HTMLElement): string {
    let text: string = QuestionsUtil.getQuestionText(que);

    let images: NodeListOf<HTMLImageElement> = QuestionsUtil.getQuestionImages(que);
    images.forEach(image => {
      text += image.src;
    });
    
    return squeezeText(text);
  }

  static getQuestionText(que: HTMLElement): string {
    return que.querySelector('.qtext').textContent;
  }

  static getQuestionImages(que: HTMLElement) : NodeListOf<HTMLImageElement> {
    return que.querySelectorAll(".qtext img")
  }

  static getInput(que : HTMLElement): HTMLInputElement {
    return que.querySelector(".answer>input") as HTMLInputElement;
  }

  public static isCorrect(elem : HTMLElement) : boolean {
    return elem.classList.contains("correct") 
      || !!elem.querySelector(".icon.fa.fa-check.text-success.fa-fw");
  }

  public static isIncorrect(elem : HTMLElement) : boolean {
    return elem.classList.contains("incorrect") 
      || !!elem.querySelector(".icon.fa.fa-remove.text-danger.fa-fw");
  }
}