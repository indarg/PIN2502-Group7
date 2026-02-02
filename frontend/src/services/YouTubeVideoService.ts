import { TYoutubeVideo } from "src/models/TYoutubeVideo";
import HttpService from "./HttpService";

export default class YouTubeVideoService extends HttpService<TYoutubeVideo> {


  constructor() {
    super('v1/motor-insight/yt-videos/');
  }

}