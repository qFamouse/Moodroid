import { Command } from "./Command"
import type { Question } from "./Question";
import type { Request } from "./Request";

export class AddRequest implements Request {
    readonly command: Command = Command.Add;

    constructor(readonly key: string, readonly question: Question) {
    }
};