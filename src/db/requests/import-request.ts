import { Command } from "~core/enums/command"
import type { Request } from "./request";

export class ImportRequest implements Request {
    readonly command: Command = Command.Import;

    constructor(readonly data: string) {
    }
};
