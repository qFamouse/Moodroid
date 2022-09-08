export function squeezeText(text: string) : string {

  if (!text) return text;

  let squeezedText: string = text;

  // remove whitespaces
  squeezedText = squeezedText.replace(/\s+/g, "");

  // lowercase
  squeezedText = squeezedText.toLowerCase();

  return squeezedText;
}
