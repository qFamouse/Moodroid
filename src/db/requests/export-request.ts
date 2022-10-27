import { Command } from "~core/enums/command"
import type { IRequest } from "~core/interfaces/request";

export class ExportRequest implements IRequest {
    readonly command: Command = Command.Export;
}
