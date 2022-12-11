import { ResponseStatus } from "~core/enums/response-status";
import type { IResponse } from "~core/interfaces/response";

export class FailedResponse implements IResponse {
    readonly status: ResponseStatus = ResponseStatus.Failed;

    constructor(readonly error?: Error) {}
}
