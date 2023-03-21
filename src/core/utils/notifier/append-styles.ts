import type { Styles } from "./style-type";

export function appendStyles(element: HTMLElement, styles: Styles) {
    // for (const styleName in styles) {
    //     element.style[styleName] = styles[styleName];
    // }
    Object.assign(element.style, styles);
}
