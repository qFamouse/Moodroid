import { QuestionGroup } from "~core/enums/question-group";
import { QuestionState } from "~core/enums/question-state";
import type { IAnswerParser } from "~core/interfaces/answer-parser";
import type { MultichoiceAnswer } from "~core/models/answers/multichoice-answer";
import { parseQuestionGroup } from "~core/utils/parse/parse-question-group";
import { parseQuestionState } from "~core/utils/parse/parse-question-state";

export class MultichoiceParser implements IAnswerParser {
    forceParse(que: HTMLElement, forceState: QuestionState): MultichoiceAnswer {
        let answerLabels: NodeListOf<HTMLElement> = que.querySelectorAll(`
                    .answer>[class^=r]>input[type=radio]:checked + [data-region^=answer-label]>:last-child, 
                    .answer>[class^=r]>input[type=checkbox]:checked  + [data-region^=answer-label]>:last-child`);

        return {
            correctAnswers: Array.from(answerLabels).map((answerLabel) => answerLabel.textContent),
            incorrectAnswers: [],
            state: forceState
        };
    }

    parse(que: HTMLElement): MultichoiceAnswer {
        let group: QuestionGroup = parseQuestionGroup(que);
        let state: QuestionState = parseQuestionState(que);

        if (group == QuestionGroup.complete && state == QuestionState.partiallycorrect) {
            throw new Error("Can't parse complete question in partiallycorrect state");
        }

        return {
            correctAnswers: MultichoiceParser.parseAnswers(que, group, state, true),
            incorrectAnswers: MultichoiceParser.parseAnswers(que, group, state, false),
            state: state
        };
    }

    private static parseAnswers(que: HTMLElement, group: QuestionGroup, state: QuestionState, parseCorrect: boolean): string[] {
        let answerLabels: NodeListOf<HTMLElement>;

        // Collecting answers
        switch (group) {
            case QuestionGroup.correctIncorrect:
                if (parseCorrect) {
                    answerLabels = que.querySelectorAll(".answer>[class^=r].correct>[data-region^=answer-label]>:last-child");
                } else {
                    answerLabels = que.querySelectorAll(".answer>[class^=r].incorrect>[data-region^=answer-label]>:last-child");
                }
                break;

            case QuestionGroup.complete:
                // If the group is complete, then we need to be sure that the question is correct/incorrect
                if (parseCorrect && state == QuestionState.correct) {
                    answerLabels = que.querySelectorAll(`
                    .answer>[class^=r]>input[type=radio]:checked + [data-region^=answer-label]>:last-child, 
                    .answer>[class^=r]>input[type=checkbox]:checked  + [data-region^=answer-label]>:last-child`);
                }
                // Parse incorrect only for radio (in checkbox we can't sure)
                else if (!parseCorrect && state == QuestionState.incorrect) {
                    answerLabels = que.querySelectorAll(`
                    .answer>[class^=r]>input[type=radio]:checked + [data-region^=answer-label]>:last-child`);
                }
                else {
                    return [];
                }
                break;

            default:
                throw new Error("Unsupported group");
        }

        return Array.from(answerLabels).map((answerLabel) => answerLabel.textContent);
    }
}
