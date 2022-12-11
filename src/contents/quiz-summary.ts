import type { PlasmoContentScript } from "plasmo";

import { ExtensionMode } from "~core/enums/extension-mode";
import { QuestionState } from "~core/enums/question-state";
import type { QuestionType } from "~core/enums/question-type";
import type { IAnswer } from "~core/interfaces/answer";
import { Question } from "~core/models/question";
import { AccessValidator } from "~core/utils/access-validator";
import { AnswerParserFactory } from "~core/utils/answer-parser-factory";
import { ExtensionApi } from "~core/utils/extension-api";
import { generateQuestionKey } from "~core/utils/generate-question-key";
import { parseQuestionText } from "~core/utils/parse/parse-question-text";
import { parseQuestionType } from "~core/utils/parse/parse-question-type";
import { QuestionDatabase } from "~db/question-database";

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/summary.php*"]
};

window.addEventListener("load", async () => {
    await AccessValidator.validate();

    await ExtensionApi.setCurrentMode(ExtensionMode.exam);
    await ExtensionApi.setExplicitParsingState(true);

    if (await ExtensionApi.getExplicitParsingState()) {
        let main: HTMLElement = document.querySelector("[role=main]");

        let explicitParsingBtn = appendMdlAlignButton(main, "Explicit Parsing");
        explicitParsingBtn.onclick = async () => {
            explicitParsingBtn.disabled = true;
            explicitParsingBtn.textContent = "parsing...";
            let count = await explicitParsing();
            explicitParsingBtn.disabled = false;
            explicitParsingBtn.textContent = `Success ${count}`;
        };
    }
});

function appendMdlAlignButton(parent: HTMLElement, title: string): HTMLButtonElement {
    let button = document.createElement("button");
    button.textContent = title;
    button.className = "btn btn-dark";
    button.style.alignSelf = "center";
    button.style.marginBottom = "5px";
    button.onclick = onclick;

    let div = document.createElement("div");
    div.className = "mdl-align";
    div.appendChild(button);

    parent.appendChild(div);

    return button;
}

async function explicitParsing(): Promise<number> {
    let summaries: NodeListOf<HTMLTableRowElement> = document.querySelectorAll(".quizsummaryofattempt .answersaved");
    let successCount: number = 0;

    for (const summary of summaries) {
        let anchor: HTMLAnchorElement = summary.querySelector("a");
        let td = summary.querySelector("td:last-child");

        let response = await fetch(anchor.href, { method: "GET" });

        if (response.ok) {
            let text = await response.text();

            let parser = new DOMParser();
            let answerDocument = parser.parseFromString(text, "text/html");

            let que = answerDocument.querySelector(".que") as HTMLElement;

            if (que) {
                try {
                    let type: QuestionType = parseQuestionType(que);
                    let text: string = parseQuestionText(que);
                    let answer: IAnswer = AnswerParserFactory.getAnswerParser(type)?.forceParse(que, QuestionState.partiallycorrect);

                    if (type && text && answer) {
                        let question = new Question(text, type, answer);
                        console.log("Parsed question", question);

                        let key = generateQuestionKey(que);
                        QuestionDatabase.add(key, question);
                        td.textContent += " ✅";
                        successCount++;
                    }
                } catch (e) {
                    console.warn(e, summary);
                }
            }
        }
    }

    return successCount;
}
