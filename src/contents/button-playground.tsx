import type { PlasmoContentScript } from "plasmo"
import { createRoot } from "react-dom/client";
import SaveButton, { allGood } from "../components/save-button";

export const config: PlasmoContentScript = {
  matches: ["*://newsdo.vsu.by/mod/quiz/review.php*"],
}

function sd() {
  alert('yes!vvd');
}

const SaveButtonContainer = () => {
  return (
    <SaveButton onClick={sd}></SaveButton>
  )
}

window.addEventListener('load', () => {
  const infoBlocks = document.querySelectorAll(".info");// The compose windows' bottom sheet

  infoBlocks.forEach((infoBlock) => {
    if(infoBlock.querySelector('#item')) return;

    const container = document.createElement('div');
    container.id = "#item";
    infoBlock.append(container);
    
    let root = createRoot(container);
    root.render(<SaveButtonContainer/>)
  })
})

// const observer = new MutationObserver(() => {

//   messageWindows.forEach((messageWindowHotbar) => {
//     if (!messageWindowHotbar.querySelector("#agreeto-item")) {
//       const sendButton = messageWindowHotbar.childNodes.item(0);

//       const container = document.createElement("div");
//       container.id = "agreeto-item";
//       sendButton?.parentNode?.insertBefore(container, sendButton.nextSibling);

//       let root = createRoot(container);
//       root.render(<GmailItem />);
//     }
//   });
// });

// observer.observe(document.body, { childList: true });
