import { SummaryHeader } from "~core/enums/summary-header";
import { Attempt } from "~core/models/attempt";

// TODO: Add query to select what parse
export function parseSummaryRow(row: HTMLTableRowElement, navigator: Array<SummaryHeader>): Attempt {
    let attempt = new Attempt();

    let attemptCell = row.cells[navigator[SummaryHeader.attempt]];
    if (attemptCell) {
        let attemptValue = Number.parseInt(attemptCell.textContent);
        attempt.attempt = isNaN(attemptValue) ? undefined : attemptValue;
    }

    let stateCell = row.cells[navigator[SummaryHeader.state]];
    if (stateCell) {
        attempt.state = stateCell.innerText.split("\n");
    }

    let markCell = row.cells[navigator[SummaryHeader.mark]];
    if (markCell) {
        let markValue = Number.parseFloat(markCell.textContent.replace(",", "."));
        attempt.mark = isNaN(markValue) ? undefined : markValue;
    }

    let gradeCell = row.cells[navigator[SummaryHeader.grade]];
    if (gradeCell) {
        let gradeValue = Number.parseFloat(gradeCell.textContent.replace(",", "."));
        attempt.grade = isNaN(gradeValue) ? undefined : gradeValue;
    }

    let reviewCell = row.cells[navigator[SummaryHeader.review]];
    if (reviewCell) {
        let anchor = reviewCell.querySelector("a");
        attempt.review = {
            isPermitted: !!anchor, // anchor ? true : false
            href: anchor ? `${anchor.href}&showall=1` : undefined // &showall=1 - for view all questions
        };
    }

    return attempt;
}
