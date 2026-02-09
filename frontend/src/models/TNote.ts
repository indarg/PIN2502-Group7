import { TAudit } from "./TAudit";
import { TMediaFile } from "./TMediaFile";
import { TTag } from "./TTag";

export type TNote = TAudit & {
    id: number;
    description: string,
    headline: string; // titulo
    lead: string; // encabezado
    body: string;
    closure: string; // cierre
    mainImage: TMediaFile,
    images: TMediaFile[];
    videos: TMediaFile[];
    tags: TTag[];
    published: boolean;
    draft: boolean;

}

