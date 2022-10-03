import { Command } from "~core/enums/command"
import type { Question } from "~core/models/question";
import type { IRequest } from "./request";

export class AddRequest implements IRequest {
    readonly command: Command = Command.Add;

    constructor(readonly key: string, readonly question: Question) {
    }
}
