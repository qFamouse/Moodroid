import {parseQuestionText} from "~question-parser/shared/parse-question-text";
import {squeezeText} from "~utils/squeezeText";

export function generateQuestionKey(que) : string {
    let text: string = parseQuestionText(que);

    // let images: NodeListOf<HTMLImageElement> = QuestionsUtil.getQuestionImages(que);
    // images.forEach(image => {
    //     text += image.src;
    // });

    return squeezeText(text);
}
