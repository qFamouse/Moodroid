import { SuccessResponse } from "./success-response";

export class SuccessResponseWithData<T> extends SuccessResponse {
    constructor(public readonly data: T) {
        super();
    }
}
