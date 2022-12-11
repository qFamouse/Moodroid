import type { IResponse } from "~core/interfaces/response";
import { ResponseStatus } from "~core/enums/response-status";

export class FailedResponse implements IResponse {
    readonly status: ResponseStatus = ResponseStatus.Failed;

    constructor(readonly error?: Error) {
    }
}
