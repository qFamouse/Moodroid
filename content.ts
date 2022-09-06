import type { PlasmoContentScript } from "plasmo"

export const config: PlasmoContentScript = {
    matches: ["https://newsdo.vsu.by/"]
}

window.addEventListener("load", () => {
    console.log("Hello World")
})