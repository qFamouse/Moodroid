import type { IResponse } from "~core/interfaces/response";
import { ResponseStatus } from "~core/enums/response-status";

export class SuccessResponse implements IResponse {
    readonly status: ResponseStatus = ResponseStatus.Success;
}
