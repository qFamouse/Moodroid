import type {IAnswerParser} from "~core/interfaces/answer-parser";
import {QuestionGroup} from "~core/enums/question-group";
import {parseQuestionGroup} from "~core/utils/parse/parse-question-group";
import {QuestionState} from "~core/enums/question-state";
import {parseQuestionState} from "~core/utils/parse/parse-question-state";
import {MatchAnswer} from "~core/models/answers/match-answer";

export class MatchParser implements IAnswerParser {
    parse(que: HTMLElement) : MatchAnswer {
        let group : QuestionGroup = parseQuestionGroup(que);
        let rows : NodeListOf<HTMLElement> = que.querySelectorAll("tbody>[class^=r]");
        let state : QuestionState = parseQuestionState(que);

        let matchAnswer : MatchAnswer = new MatchAnswer();
        matchAnswer.state = state;

        switch (group) {
            case QuestionGroup.correctIncorrect:
                rows.forEach(row => {
                    let answerText : string = row.querySelector(".text").textContent;
                    let correctAnswer : string = row.querySelector(".correct>select>option:checked")?.textContent ?? undefined;
                    let incorrectAnswer : string = row.querySelector(".incorrect>select>option:checked")?.textContent ?? undefined;

                    matchAnswer.answers[answerText] = {
                        correctAnswer: correctAnswer,
                        incorrectAnswers: incorrectAnswer ? new Array(incorrectAnswer) : []
                    }
                });
                return matchAnswer;

            case QuestionGroup.complete:
                // let state = parseQuestionState(que);
                if (state == QuestionState.correct || state == QuestionState.incorrect) {
                    rows.forEach(row => {
                        let answerText : string = row.querySelector(".text").textContent;
                        let answer : string = row.querySelector("select>option:checked")?.textContent ?? undefined;

                        matchAnswer.answers[answerText] = {
                            correctAnswer: state == QuestionState.correct ? answer : undefined,
                            incorrectAnswers: state == QuestionState.incorrect ? new Array(answer) : []
                        }
                    })
                }
                else {
                    throw new Error("From this state of the question, it is not possible to find out the correct or incorrect answers");
                }
                return matchAnswer;

            default:
                throw new Error("Unsupported group")
        }
    }
}
