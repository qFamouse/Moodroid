import {parseQuestionText} from "~core/utils/parse/parse-question-text";

export function generateQuestionKey(que) : string {
    let text: string = parseQuestionText(que);

    // let images: NodeListOf<HTMLImageElement> = QuestionsUtil.getQuestionImages(que);
    // images.forEach(image => {
    //     text += image.src;
    // });

    // remove whitespaces
    text = text.replace(/\s+/g, "");

    // lowercase
    text = text.toLowerCase();

    return text;
}
