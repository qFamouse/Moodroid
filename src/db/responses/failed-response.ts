import type { Response } from "./response";
import { ResponseStatus } from "../../core/enums/response-status";

export class FailedResponse implements Response {
    readonly status: ResponseStatus = ResponseStatus.Failed;

    constructor(readonly error?: Error) {
    }
}
