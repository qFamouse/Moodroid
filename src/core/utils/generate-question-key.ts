import { parseQuestionText } from "~core/utils/parse/parse-question-text";

export function generateQuestionKey(que : HTMLElement): string {
    let key: string = parseQuestionText(que)
        .replace(/\s+/g, "") // remove spaces " "
        .toLowerCase();

    // Take pictures from the content
    // Because moodle scripts convert some images (img) to inputs (input[type=image]).
    // This was found in 'info'
    let images: Array<HTMLImageElement> = Array.from(que.querySelectorAll(".content img"));

    if (images.length > 0) {
        let sources: Array<URL> = images.map((i) => new URL(i.src));
        // key#img:hostname_last2segments
        let imgKeys: Array<string> = sources.map((s) => `#img:${s.hostname}_${s.pathname.split("/").slice(-2).join("/")}`);

        key += imgKeys.sort().join("");
    }

    return key;
}
