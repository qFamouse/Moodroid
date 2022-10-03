import { Command } from "~core/enums/command"
import type { IRequest } from "./request";

export class GetRequest implements IRequest {
    readonly command: Command = Command.Get;

    constructor(readonly key: string) {
    }
}
