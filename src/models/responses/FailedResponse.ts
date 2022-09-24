import type { Response } from "./Response";
import { ResponseStatus } from "../statuses/ResponseStatus";

export class FailedResponse implements Response {
    readonly status: ResponseStatus = ResponseStatus.Failed;

    constructor(readonly error?: Error) {
    }
}