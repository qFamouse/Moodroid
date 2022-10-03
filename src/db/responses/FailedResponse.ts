import type { Response } from "./Response";
import { ResponseStatus } from "../../core/enums/ResponseStatus";

export class FailedResponse implements Response {
    readonly status: ResponseStatus = ResponseStatus.Failed;

    constructor(readonly error?: Error) {
    }
}
