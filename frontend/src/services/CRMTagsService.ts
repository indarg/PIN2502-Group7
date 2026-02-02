import { TTag } from "src/models/TTag";
import HttpService from "./HttpService";
import { TResponse } from "src/models/response/TResponses";
import { httpServer } from "src/clients/mw-server";

export default class CRMTagService extends HttpService<TTag> {


  constructor() {
    super('v1/motor-insight/crm/tags/');
  }

  getAllTags(): Promise<TResponse<TTag[]>> {
    const endpoint = `/${this.baseUrl}all`;
    return httpServer.get(endpoint)
      .then(({ data }: any): TResponse<TTag[]> => data as TResponse<TTag[]>)
  }

}