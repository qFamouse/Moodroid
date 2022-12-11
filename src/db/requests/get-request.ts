import { Command } from "~core/enums/command"
import type { IRequest } from "~core/interfaces/request"

export class GetRequest implements IRequest {
    readonly command: Command = Command.Get

    constructor(readonly key: string) {}
}
