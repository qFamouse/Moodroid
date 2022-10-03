import type { IResponse } from "./response";
import { ResponseStatus } from "~core/enums/response-status";

export class SuccessResponse implements IResponse {
    readonly status: ResponseStatus = ResponseStatus.Success;
}
