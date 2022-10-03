import { Command } from "~core/enums/command"
import type { Request } from "./request";

export class ClearRequest implements Request {
    readonly command: Command = Command.Clear;
};
