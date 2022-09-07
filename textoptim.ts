export function optim(text: string) : string {

  if (!text) return text;

  let optimText: string = text;

  // remove html tags
  let p: HTMLElement = document.createElement("p");
  p.innerHTML = optimText;
  optimText = p.textContent || p.innerHTML || "";

  // remove whitespaces
  optimText = optimText.replace(/\s+/g, "");

  // lowercase
  optimText = optimText.toLowerCase();

  return optimText;
}