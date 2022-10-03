import { Command } from "~core/enums/command"
import type { Request } from "./request";

export class ExportRequest implements Request {
    readonly command: Command = Command.Export;
};
