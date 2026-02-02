import { TYoutubeVideo } from "src/models/TYoutubeVideo";
import HttpService from "./HttpService";
import { TResponse } from "src/models/response/TResponses";
import { httpServer } from "src/clients/mw-server";
import { TUpdateOrder } from "src/models/TUpdateOrder";

export default class CRMYouTubeVideoService extends HttpService<TYoutubeVideo> {

  constructor() {
    super('v1/motor-insight/crm/yt-videos/');
  }

  updateVideoOrder(videos:TUpdateOrder): Promise<TResponse<string>> {
    const endpoint = `/${this.baseUrl}update/order/`;
    return httpServer.put(endpoint,{videos})
      .then(({ data }: any): TResponse<string> => data as TResponse<string>)
      .catch(({ response }: any): TResponse<string> => response.data as TResponse<string>);
  }

}