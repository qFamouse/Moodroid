import { Command } from "./Command"
import type { Request } from "./Request";

export class ImportRequest implements Request {
    readonly command: Command = Command.Import;

    constructor(readonly data: string) {
    }
};