export function squeezeText(text: string) : string {

  if (!text) return text;

  let optimText: string = text;

  // remove whitespaces
  optimText = optimText.replace(/\s+/g, "");

  // lowercase
  optimText = optimText.toLowerCase();

  return optimText;
}
