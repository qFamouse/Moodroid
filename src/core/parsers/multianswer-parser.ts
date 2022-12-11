import type {IAnswerParser} from "~core/interfaces/answer-parser";
import {MultianswerAnswer} from "~core/models/answers/multianswer-answer";
import {QuestionState} from "~core/enums/question-state";
import {parseQuestionState} from "~core/utils/parse/parse-question-state";
import {QuestionGroup} from "~core/enums/question-group";
import {parseQuestionGroup} from "~core/utils/parse/parse-question-group";

export class MultianswerParser implements IAnswerParser {
    forceParse(que: HTMLElement, forceState: QuestionState): MultianswerAnswer {
        let answerContainer: HTMLElement = que.querySelector("input[type=hidden]+p+p");
        let inputs: NodeListOf<HTMLInputElement> = answerContainer.querySelectorAll("input");

        let multianswerAnswer = new MultianswerAnswer();
        multianswerAnswer.state = forceState;

        inputs.forEach((input) => {
            multianswerAnswer.answers.push(input.value);
        });

        return multianswerAnswer
    }
    parse(que: HTMLElement): MultianswerAnswer {
        let state : QuestionState = parseQuestionState(que);
        let group : QuestionGroup = parseQuestionGroup(que);

        if (state != QuestionState.correct && state != QuestionState.partiallycorrect) {
            throw new Error("Save only the correct/partiallycorrect answers");
        }

        let answerContainer : HTMLElement = que.querySelector("input[type=hidden]+p+p");
        let inputs : NodeListOf<HTMLInputElement> = answerContainer.querySelectorAll("input")
        let multianswerAnswer = new MultianswerAnswer()
        multianswerAnswer.state = state;

        switch (group) {
            case QuestionGroup.correctIncorrect:

                inputs.forEach(input => {
                    let answerCheckIcon = input.nextSibling as HTMLElement;
                    if (answerCheckIcon.classList.contains("text-success")) {
                        multianswerAnswer.answers.push(input.value);
                    }
                    else {
                        multianswerAnswer.answers.push("");
                    }
                });
                return multianswerAnswer;

            case QuestionGroup.complete:
                if (state == QuestionState.correct) {
                    inputs.forEach(input => {
                        multianswerAnswer.answers.push(input.value);
                    })
                }
                else {
                    throw new Error("Can't save partiallycorrect answer in complete question")
                }
                return multianswerAnswer;
        }
    }
}
