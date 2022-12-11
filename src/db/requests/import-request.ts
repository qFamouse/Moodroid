import { Command } from "~core/enums/command"
import type { IRequest } from "~core/interfaces/request"

export class ImportRequest implements IRequest {
    readonly command: Command = Command.Import

    constructor(readonly data: string) {}
}
