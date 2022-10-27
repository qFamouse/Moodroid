import { QuestionType } from "~core/enums/question-type"
import type { IAnswerMerger } from "~core/interfaces/answer-merger"

import { AnswerOverwriteMerger } from "./answer-overwrite-merger"
import { MatchMerger } from "./match-merger"
import { MultianswerMerger } from "./multianswer-merger"
import { MultichoiceMerger } from "./multichoice-merger"

export class AnswerMergerFactory {
    private static questionTypeAnswerMerger: Map<
        QuestionType,
        () => IAnswerMerger
    > = new Map([
        [QuestionType.multichoice, () => new MultichoiceMerger()],
        [QuestionType.match, () => new MatchMerger()],
        [QuestionType.shortanswer, () => new AnswerOverwriteMerger()],
        [QuestionType.essay, () => new AnswerOverwriteMerger()],
        [QuestionType.multianswer, () => new MultianswerMerger()]
    ])

    static getAnswerMerger(
        questionType: QuestionType
    ): IAnswerMerger | undefined {
        let constructor: () => IAnswerMerger =
            AnswerMergerFactory.questionTypeAnswerMerger.get(questionType)

        if (!constructor) return

        return constructor()
    }
}
