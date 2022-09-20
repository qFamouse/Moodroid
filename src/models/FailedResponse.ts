import type { Response } from "./Response";
import { Status } from "./Status";

export class FailedResponse implements Response {
    readonly status: Status = Status.Failed;
}