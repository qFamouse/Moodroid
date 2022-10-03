import type { Response } from "./response";
import { ResponseStatus } from "~core/enums/response-status";

export class SuccessResponse implements Response {
    readonly status: ResponseStatus = ResponseStatus.Success;
}
