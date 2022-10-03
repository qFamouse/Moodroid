import { Command } from "../../core/enums/Command"
import type { Request } from "./Request";

export class ClearRequest implements Request {
    readonly command: Command = Command.Clear;
};
