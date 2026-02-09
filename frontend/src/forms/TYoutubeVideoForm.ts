import { TAudit } from "src/models/TAudit";
import { TYoutubeVideo } from "src/models/TYoutubeVideo";

export type TYoutubeVideoForm = Partial<Omit<TYoutubeVideo, keyof TAudit>>;