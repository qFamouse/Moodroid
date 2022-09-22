import type {IQuestionParser} from "~parser/Interfaces/IQuestionParser";
import {QuestionType} from "~models/QuestionType";
import {QuestionState} from "~parser/QuestionState";

export class QuestionParser implements IQuestionParser {
    private readonly _questionType : QuestionType;
    private _questionText : string;
    private readonly _questionState : QuestionState;
    private _questionImages : Array<HTMLImageElement>;

    get questionType() : QuestionType {
        return this._questionType;
    }

    get questionText() : string {
        return this._questionType;
    }

    get questionState() : QuestionState {
        return this._questionState;
    }

    get questionImages() : Array<HTMLImageElement> {
        return this._questionImages === undefined ? this._questionImages = this.parseToQuestionImages() : this._questionImages;
    }

    /**
     * @param {HTMLElement} _que HTMLElement with 'que' class
     * @throws If the item is not supported as a question
     * @throws Unknown question type
     * @throws unknown question structure
     */
    constructor(private _que : HTMLElement) {
        // The parser only works with elements of the 'que' class
        if (!_que.classList.contains("que")) {
            throw new Error(`Parser cannot work with this element: ${_que.innerHTML}`)
        }

        this._questionType = this.parseToQuestionType();
        this._questionText = this.parseToQuestionText();
        this._questionState = this.parseToQuestionState();
    }

    /**
     * Parse type from question element
     * @return {QuestionType}
     * @throws Unknown question type
     * @private
     */
    private parseToQuestionType() : QuestionType {
        let domTokenList = this._que.classList;
        for (let token of domTokenList) {
            if (token in QuestionType) {
                return QuestionType[token]
            }
        }

        throw new Error(`Unknown question type: ${domTokenList.toString()}`)
    }

    /**
     * Parse text from question element
     * @return {string} question text
     * @private
     */
    private parseToQuestionText() : string {
        let qtext = this._que.querySelector('.qtext').textContent

        if (!qtext) {
            throw new Error("Undefined QuestionText");
        }

        return qtext;
    }

    /**
     * Parse question state
     * @return {QuestionState} QuestionState in case of successful parsing, otherwise throw error
     * @throws unknown question structure
     * @private
     */
    private parseToQuestionState() : QuestionState {
        // Stage 1 - Parse by class names
        let domTokenList = this._que.classList;
        for (let token of domTokenList) {
            if (token in QuestionState) {
                return QuestionState[token];
            }
        }

        // Stage 2 - else Parse by 2 marks
        let gradeElement : HTMLElement = this._que.querySelector('.grade');
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
            }

        // Stage 3 - else Parse by any count of marks
            else {
                // TODO: Use AnswerParser to check state
            }
        }

        // Stage 4 - I have no idea what the structure of the question is
        throw new Error(`parseToQuestionState: unknown question structure. ${this._que}`);
    }

    /**
     * Parses all the pictures in the text of the question (not the answers)
     * @return {Array<HTMLImageElement>} Array<HTMLImageElement> with the pictures we were able to find, the length is 0 if they are missing
     * @private
     */
    private parseToQuestionImages() : Array<HTMLImageElement> {
        let nodeList = this._que.querySelectorAll(".qtext img") as NodeListOf<HTMLImageElement>;

        return Array.from(nodeList)
    }

}
