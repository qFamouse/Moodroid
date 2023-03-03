import type { PlasmoContentScript } from "plasmo";

import { HEADER_VALUES } from "~core/constants/attempt-header-values";
import { QuestionState } from "~core/enums/question-state";
import { SummaryHeader } from "~core/enums/summary-header";
import type { Attempt } from "~core/models/attempt";
import type { Question } from "~core/models/question";
import { QuestionParser } from "~core/parsers/question-parser";
import { AccessValidator } from "~core/utils/access-validator";
import { calculateMedian } from "~core/utils/calculate-median";
import { generateQuestionKey } from "~core/utils/generate-question-key";
import { generateShareText } from "~core/utils/generate-share-text";
import { parseSummaryRow } from "~core/utils/parse/parse-summary-row";
import { replacer } from "~db/question-database";
import { download } from "~popup/utils/download";

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/view.php*"]
};
window.addEventListener("load", async () => {
    await AccessValidator.validate();

    let lang = document.documentElement.lang;

    let discipline = document.querySelector(".page-context-header, .page-header-headings").textContent;
    let test = document.querySelector("h2").innerText;
    let tag = location.hostname.split(".").slice(-2).join(".");

    let table: HTMLTableElement = document.querySelector(".quizattemptsummary");
    let headers: NodeListOf<HTMLTableCellElement> = table.querySelectorAll("thead>tr>th");

    let navigator = new Array<SummaryHeader>(); // Array of matching the header to its type
    headers.forEach((header, index) => {
        let firstWord = header.textContent.replace(/ .*/, "");
        let headerType: SummaryHeader = HEADER_VALUES[lang].get(firstWord);
        if (headerType) {
            navigator[headerType] = index;
        }
    });

    let score = headers[navigator[SummaryHeader.grade]] ?? headers[navigator[SummaryHeader.mark]];
    let maxScore = Number.parseInt(score.textContent.match(/\d+/g)[0]);

    let attempts = new Array<Attempt>();

    let tableRows: NodeListOf<HTMLTableRowElement> = table.querySelectorAll("tbody>tr");
    tableRows.forEach((row) => {
        let attempt: Attempt = parseSummaryRow(row, navigator);

        if (!attempt.grade && !attempt.mark) {
            return;
        }

        let shareAnchor = createShareAnchor([attempt], tag, discipline, test, maxScore ?? 10);

        let reviewCell = row.cells[navigator[SummaryHeader.review]];
        reviewCell.appendChild(document.createElement("br"));
        reviewCell.appendChild(shareAnchor);

        attempts.push(attempt);
    });

    let shareAnchor = createShareAnchor(attempts, tag, discipline, test, maxScore);

    let reviewCell = headers[navigator[SummaryHeader.review]];
    reviewCell.appendChild(document.createElement("br"));
    reviewCell.appendChild(shareAnchor);
});

async function parseQuestionsByUrl(url: URL, questions: Map<string, Question> = new Map()): Promise<Map<string, Question>> {
    let response = await fetch(url);

    if (response.ok) {
        let text = await response.text();

        let parser = new DOMParser();
        let reviewDocument = parser.parseFromString(text, "text/html");

        let ques = reviewDocument.querySelectorAll(".que") as NodeListOf<HTMLElement>;

        ques?.forEach((que, i) => {
            try {
                let question: Question = QuestionParser.parse(que);

                if (!question) {
                    console.log("Can't parse");
                    return;
                }

                console.log("Parsed question", question);

                let key = generateQuestionKey(que);

                questions.set(key, question);
            } catch (e) {
                console.warn(e, i + 1);
            }
        });
    }

    return questions;
}

function createShareAnchor(allAttempts: Array<Attempt>, tag: string, discipline: string, test: string, maxScore: number): HTMLElement {
    let shareAnchor = document.createElement("a");
    shareAnchor.target = "_blank";
    shareAnchor.text = allAttempts.length > 1 ? "Share all" : "Share";
    shareAnchor.title = "Copy the information, download the result, open the chat";
    shareAnchor.style.color = "black";
    shareAnchor.style.cursor = "pointer";
    shareAnchor.style.fontWeight = "normal";

    shareAnchor.onclick = async () => {
        let correct: number | string;
        let attempts: number;
        // for situations when attempt can be noPermitted or Permitted, then we pay preference to Permitted
        let isPermitted = allAttempts.some((attempt) => attempt.review.isPermitted);
        if (isPermitted) {
            let questions = new Map<string, Question>();

            let permittedAttempts = allAttempts.filter((a) => a.review.isPermitted);
            for (const attempt of permittedAttempts) {
                await parseQuestionsByUrl(new URL(attempt.review.href), questions);
            }

            let questionValues = Array.from(questions.values());
            correct = questionValues.reduce((total, q) => (q.answer.state == QuestionState.correct ? total + 1 : total), 0);
            attempts = permittedAttempts.length;

            let grades = permittedAttempts.map((a) => a.grade ?? a.mark ?? 0);
            let median = calculateMedian(grades);

            let percentage = (median / maxScore) * 100;
            download(JSON.stringify(questions, replacer),`${isNaN(percentage) ? "database" : percentage}.json`, "application/json");
        } else {
            let notPermittedAttempts = allAttempts.filter((a) => !a.review.isPermitted).map((a) => a.grade ?? a.mark ?? 0);
            let median = calculateMedian(notPermittedAttempts);
            let percentage = (median / maxScore) * 100;

            correct = `≈${percentage}%`;
            attempts = notPermittedAttempts.length;
        }

        let sharedText = generateShareText(tag, discipline, test, correct, attempts, isPermitted);
        await navigator.clipboard.writeText(sharedText);

        shareAnchor.onclick = null;
        shareAnchor.innerHTML = "Copied!<br>Click to open telegram";
        shareAnchor.href = "https://t.me/moodroid_base";
    };

    return shareAnchor;
}
