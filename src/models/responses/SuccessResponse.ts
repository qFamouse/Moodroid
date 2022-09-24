import type { Response } from "./Response";
import { ResponseStatus } from "../statuses/ResponseStatus";

export class SuccessResponse implements Response {
    readonly status: ResponseStatus = ResponseStatus.Success;
}