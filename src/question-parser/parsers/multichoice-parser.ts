import type {IAnswerParser} from "~core/interfaces/answer-parser";
import type {MultichoiceAnswer} from "~core/models/answers/multichoice-answer";
import {parseQuestionGroup} from "~question-parser/shared/parse-question-group";
import {QuestionGroup} from "~core/models/QuestionGroup";
import {parseQuestionState} from "~question-parser/shared/parse-question-state";
import {QuestionState} from "~core/models/QuestionState";


export class MultichoiceParser implements IAnswerParser {
    parse(que: HTMLElement): MultichoiceAnswer {
        return {
            correctAnswers: MultichoiceParser.parseCorrectAnswers(que),
            incorrectAnswers: MultichoiceParser.parseIncorrectAnswers(que)
        }
    }

    private static parseCorrectAnswers(que : HTMLElement) : string[] {
        let group : QuestionGroup = parseQuestionGroup(que);
        let answerLabels : NodeListOf<HTMLElement>;
        // Collecting correct answers
        if (group == QuestionGroup.correctIncorrect) {
            answerLabels = que.querySelectorAll(".answer>[class^=r].correct>[data-region^=answer-label]>:last-child");
        }
        else if (group == QuestionGroup.complete) {
            // If the group is complete, then we need to be sure that the question is correct
            if (parseQuestionState(que) == QuestionState.correct) {
                answerLabels = que.querySelectorAll(`
                    .answer>[class^=r]>input[type=radio]:checked + [data-region^=answer-label]>:last-child, 
                    .answer>[class^=r]>input[type=checkbox]:checked  + [data-region^=answer-label]>:last-child`);
            }
            else {
                return [];
            }
        }
        else {
            throw new Error("Unsupported group");
        }

        // TODO: Fix Sdo bug - all checkbox is checked => max grade. (We do not parse that!)
        return  Array.from(answerLabels).map((answerLabel) => answerLabel.textContent);
    }

    private static parseIncorrectAnswers(que : HTMLElement) : string[] {
        let group : QuestionGroup = parseQuestionGroup(que);
        let answerLabels : NodeListOf<HTMLElement>;

        // Collecting incorrect answers
        if (group == QuestionGroup.correctIncorrect) {
            answerLabels = que.querySelectorAll(".answer>[class^=r].incorrect>[data-region^=answer-label]>:last-child");
        }
        else if (group == QuestionGroup.complete) {
            // If the group is complete, then we need to be sure that the question is incorrect
            if (parseQuestionState(que) == QuestionState.incorrect) {
                answerLabels = que.querySelectorAll(`
                    .answer>[class^=r]>input[type=radio]:checked + [data-region^=answer-label]>:last-child, 
                    .answer>[class^=r]>input[type=checkbox]:checked  + [data-region^=answer-label]>:last-child`);
            }
            else {
                return [];
            }
        }
        else {
            throw new Error("Unsupported group");
        }

        return  Array.from(answerLabels).map((answerLabel) => answerLabel.textContent);
    }
}
