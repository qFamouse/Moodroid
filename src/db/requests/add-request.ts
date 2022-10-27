import { Command } from "~core/enums/command"
import type { IRequest } from "~core/interfaces/request"
import type { Question } from "~core/models/question"

export class AddRequest implements IRequest {
    readonly command: Command = Command.Add

    constructor(readonly key: string, readonly question: Question) {}
}
