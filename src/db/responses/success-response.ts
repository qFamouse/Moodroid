import { ResponseStatus } from "~core/enums/response-status"
import type { IResponse } from "~core/interfaces/response"

export class SuccessResponse implements IResponse {
    readonly status: ResponseStatus = ResponseStatus.Success
}
