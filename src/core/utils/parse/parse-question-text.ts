export function parseQuestionText(que: HTMLElement): string {
    let qtext: HTMLElement = undefined;

    let phase = 0; // Number of parser phase [0 ... ∞] = [more general ... specific]
    while (!qtext) {
        switch (phase++) {
            case 0:
                qtext = que.querySelector(".qtext");
                break;

            case 1:
                qtext = que.querySelector("input[type=hidden]+p");
                break;

            default:
                throw new Error(`Cannot parse text from question. qtext is undefined ${que}`);
        }
    }

    return qtext.innerText;
}
