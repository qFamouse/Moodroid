export class MatchElement {
    constructor(
        readonly text : Element,
        readonly control : Element
    ) {
        if (!text.classList.contains("text")) {
            throw new Error("MatchElement 'text' parameter must have 'text' class name")
        }

        if (!control.classList.contains("control")) {
            throw new Error("MatchElement 'text' parameter must have 'text' class name")
        }
    }

    public getOptions() : NodeListOf<HTMLOptionElement> {
        return this.control.querySelectorAll("option");
    }
}
