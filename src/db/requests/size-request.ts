import { Command } from "~core/enums/command"
import type {IRequest} from "~db/requests/request";

export class SizeRequest implements IRequest {
    readonly command: Command = Command.Size;
}
