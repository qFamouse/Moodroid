import { optim } from "~textoptim";

test("should return null", () => {
  let expected: string = null;

  let actual: string = optim(null);

  expect(actual).toBe(expected);
});

test("should remove whitespaces and lowercase", () => {
  let text: string = "  Simple text.  ";
  let expected: string = "simpletext.";

  let actual: string = optim(text);

  expect(actual).toBe(expected);
});