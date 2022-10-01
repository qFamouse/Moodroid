export function parseQuestionText(que: HTMLElement) : string {
    let qtext : HTMLElement = que.querySelector(".qtext");

    if (qtext) {
        return qtext.textContent;
    }

    throw new Error(`Cannot parse text from question. qtext is undefined ${que}`);
}
