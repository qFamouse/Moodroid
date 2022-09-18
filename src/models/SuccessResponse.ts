import type { Response } from "./Response";
import { Status } from "./Status";

export class SuccessResponse implements Response {
    readonly status: Status = Status.Success;
}