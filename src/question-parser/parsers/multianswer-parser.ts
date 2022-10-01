import type {IAnswerParser} from "~core/interfaces/answer-parser";
import {MultianswerAnswer} from "~core/models/answers/multianswer-answer";
import {QuestionState} from "~core/models/QuestionState";
import {parseQuestionState} from "~question-parser/shared/parse-question-state";
import {QuestionGroup} from "~core/models/QuestionGroup";
import {parseQuestionGroup} from "~question-parser/shared/parse-question-group";

export class MultianswerParser implements IAnswerParser {
    parse(que: HTMLElement): MultianswerAnswer {
        let state : QuestionState = parseQuestionState(que);
        let group : QuestionGroup = parseQuestionGroup(que);

        if (state != QuestionState.correct && state != QuestionState.partiallycorrect) {
            throw new Error("Save only the correct answers");
        }

        let answerContainer : HTMLElement = que.querySelector("input[type=hidden]+p+p");
        let inputs : NodeListOf<HTMLInputElement> = answerContainer.querySelectorAll("input")
        let multianswerAnswer = new MultianswerAnswer()

        switch (group) {
            case QuestionGroup.correctIncorrect:
                inputs.forEach(input => {
                    let answerCheckIcon = input.nextSibling as HTMLElement;
                    if (answerCheckIcon.classList.contains("text-success")) {
                        multianswerAnswer.answers.push(input.value);
                    }
                });
                return multianswerAnswer;

            case QuestionGroup.complete:
                if (state == QuestionState.correct) {
                    inputs.forEach(input => {
                        multianswerAnswer.answers.push(input.value);
                    })
                }
                return multianswerAnswer;
        }
    }
}
