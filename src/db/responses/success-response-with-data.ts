import { SuccessResponse } from "./success-response";

export class SuccessResponseWithData extends SuccessResponse {
  constructor(readonly data: any) {
    super();
  }
}
