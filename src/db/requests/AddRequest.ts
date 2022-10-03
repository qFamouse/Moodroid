import { Command } from "../../core/enums/Command"
import type { Question } from "../../core/models/Question";
import type { Request } from "./Request";

export class AddRequest implements Request {
    readonly command: Command = Command.Add;

    constructor(readonly key: string, readonly question: Question) {
    }
};
