import { Command } from "~core/enums/command"
import type { Question } from "~core/models/question";
import type { Request } from "./request";

export class AddRequest implements Request {
    readonly command: Command = Command.Add;

    constructor(readonly key: string, readonly question: Question) {
    }
};
