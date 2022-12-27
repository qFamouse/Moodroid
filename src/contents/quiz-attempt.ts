import type { PlasmoContentScript } from "plasmo";

import { ExtensionMode } from "~core/enums/extension-mode";
import type { IAnswerer } from "~core/interfaces/answerer";
import { AccessValidator } from "~core/utils/access-validator";
import { AnswerersFactory } from "~core/utils/answerers-factory";
import { ExtensionApi } from "~core/utils/extension-api";
import { generateQuestionKey } from "~core/utils/generate-question-key";
import { parseQuestionType } from "~core/utils/parse/parse-question-type";
import { QuestionDatabase } from "~db/question-database";

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/attempt.php*"]
};

window.addEventListener("load", async () => {
    await AccessValidator.validate();

    let currentExtensionMode: ExtensionMode = await ExtensionApi.getCurrentMode();

    if (currentExtensionMode === ExtensionMode.disabled) {
        console.log("Disabled mode");
        return;
    }

    let ques = document.querySelectorAll(".que") as NodeListOf<HTMLElement>;

    ques.forEach((que, i) => {
        let key: string = generateQuestionKey(que);

        QuestionDatabase.get(key).then((question) => {
            if (!question && currentExtensionMode !== ExtensionMode.roll) {
                console.log("Not found", key);
                return;
            }

            let answerer: IAnswerer = AnswerersFactory.getAnswerer(question?.type || parseQuestionType(que));

            if (!answerer) {
                console.log("Answerer not found", question.type);
                return;
            }

            try {
                switch (currentExtensionMode) {
                    case ExtensionMode.exam:
                        return question ? answerer.exam(que, question) : undefined;
                    case ExtensionMode.hack:
                        return question ? answerer.hack(que, question) : undefined;
                    case ExtensionMode.adventure:
                        return question ? answerer.adventure(que, question) : undefined;
                    case ExtensionMode.roll:
                        return answerer.roll(que, question);
                    default:
                        console.warn("Unsupported extension mode", i);
                }
            } catch (e) {
                console.warn(e, i);
            }
        });
    });
});
