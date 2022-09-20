import { Command } from "./Command"
import type { Request } from "./Request";

export class GetRequest implements Request {
    readonly command: Command = Command.Get;

    constructor(readonly key: string) {
    }
};