import { Command } from "./Command"
import type { Request } from "./Request";

export class ExportRequest implements Request {
    readonly command: Command = Command.Export;
};