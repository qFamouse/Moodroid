import { squeezeText } from "~squeezeText";

test("should return null", () => {
  let expected: string = null;

  let actual: string = squeezeText(null);

  expect(actual).toBe(expected);
});

test("should remove whitespaces and lowercase", () => {
  let text: string = "  Simple text.  ";
  let expected: string = "simpletext.";

  let actual: string = squeezeText(text);

  expect(actual).toBe(expected);
});