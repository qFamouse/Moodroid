import type { IAnswer } from "./IAnswer";

export class Shortanswer implements IAnswer {
  constructor(readonly text: string) { }
}