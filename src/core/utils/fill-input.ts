export function fillInput(input: HTMLInputElement | HTMLTextAreaElement, text: string): Function {
    let pos: number = 0
    let listener = function (event: KeyboardEvent) {
        if (pos < text.length && /^\w$/.test(event.key) && document.activeElement === input) {
            input.value = input.value + text[pos]
            pos++
            event.preventDefault()
        }
    }
    document.addEventListener("keydown", listener, false)
    return listener
}