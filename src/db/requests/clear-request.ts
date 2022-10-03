import { Command } from "~core/enums/command"
import type { IRequest } from "./request";

export class ClearRequest implements IRequest {
    readonly command: Command = Command.Clear;
}
