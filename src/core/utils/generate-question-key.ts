import {parseQuestionText} from "~core/utils/parse/parse-question-text";
import {squeezeText} from "~core/utils/squeeze-text";

export function generateQuestionKey(que) : string {
    let text: string = parseQuestionText(que);

    // let images: NodeListOf<HTMLImageElement> = QuestionsUtil.getQuestionImages(que);
    // images.forEach(image => {
    //     text += image.src;
    // });

    return squeezeText(text);
}
