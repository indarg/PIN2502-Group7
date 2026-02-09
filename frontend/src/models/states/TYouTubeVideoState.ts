import CRMYouTubeVideoService from "src/services/CRMYouTubeVideoService";
import { TYoutubeVideo } from "../TYoutubeVideo";


export type TCRMYouTubeVideoState = {
    ytVideos: TYoutubeVideo[],
    crmYTYoutubeService:CRMYouTubeVideoService
}

