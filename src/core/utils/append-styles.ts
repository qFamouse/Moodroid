import type { Styles } from "../types/style-type";

export function appendStyles(element: HTMLElement, styles: Styles) {
    Object.assign(element.style, styles);
}
