import type { Response } from "./Response";
import { ResponseStatus } from "../../core/enums/ResponseStatus";

export class SuccessResponse implements Response {
    readonly status: ResponseStatus = ResponseStatus.Success;
}
