import { Command } from "../../core/enums/command"
import type { Request } from "./request";

export class GetRequest implements Request {
    readonly command: Command = Command.Get;

    constructor(readonly key: string) {
    }
};
