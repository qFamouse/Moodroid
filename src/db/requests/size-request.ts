import { Command } from "~core/enums/command"
import type { IRequest } from "~core/interfaces/request"

export class SizeRequest implements IRequest {
    readonly command: Command = Command.Size
}
