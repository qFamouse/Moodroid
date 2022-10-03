import type {IAnswerParser} from "~core/interfaces/answer-parser";
import type {MultichoiceAnswer} from "~core/models/answers/multichoice-answer";
import {parseQuestionGroup} from "~core/utils/parse/parse-question-group";
import {QuestionGroup} from "~core/enums/QuestionGroup";
import {parseQuestionState} from "~core/utils/parse/parse-question-state";
import {QuestionState} from "~core/enums/QuestionState";


export class MultichoiceParser implements IAnswerParser {
    parse(que: HTMLElement): MultichoiceAnswer {
        return {
            correctAnswers: MultichoiceParser.parseAnswers(que, true),
            incorrectAnswers: MultichoiceParser.parseAnswers(que, false)
        }
    }

    private static parseAnswers(que : HTMLElement, parseCorrect : boolean) : string[] {
        let group : QuestionGroup = parseQuestionGroup(que);
        let state : QuestionState = parseQuestionState(que);
        let answerLabels : NodeListOf<HTMLElement>;

        // Collecting answers
        switch (group) {
            case QuestionGroup.correctIncorrect:
                if (parseCorrect) {
                    answerLabels = que.querySelectorAll(".answer>[class^=r].correct>[data-region^=answer-label]>:last-child");
                }
                else {
                    answerLabels = que.querySelectorAll(".answer>[class^=r].incorrect>[data-region^=answer-label]>:last-child");
                }
                break;

            case QuestionGroup.complete:
                // If the group is complete, then we need to be sure that the question is correct/incorrect
                if ( (parseCorrect && state == QuestionState.correct) || (!parseCorrect && state == QuestionState.incorrect) ) {
                    answerLabels = que.querySelectorAll(`
                    .answer>[class^=r]>input[type=radio]:checked + [data-region^=answer-label]>:last-child, 
                    .answer>[class^=r]>input[type=checkbox]:checked  + [data-region^=answer-label]>:last-child`);
                }
                else {
                    return [];
                }
                break;

            default:
                throw new Error("Unsupported group");
        }

        if (state == QuestionState.correct) {
            // TODO: Fix Sdo bug - all checkbox is checked => max grade. (We do not parse that!)
        }

        return Array.from(answerLabels).map((answerLabel) => answerLabel.textContent);
    }
}
