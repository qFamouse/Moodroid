import { SuccessResponse } from "./SuccessResponse";

export class SuccessResponseWithData extends SuccessResponse {
  constructor(readonly data: any) {
    super();
  }
}