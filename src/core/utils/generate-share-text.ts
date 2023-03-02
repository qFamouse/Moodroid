export function generateShareText(
    tag: string,
    discipline: string,
    test: string,
    correct: number | string,
    attempts: number,
    review: boolean
) {
    return `#${tag}
Discipline: ${discipline}
Test: ${test}
Correct: ${correct}
Attempts: ${attempts}
Review: ${review ? "allowed" : "forbidden"}`;
}
