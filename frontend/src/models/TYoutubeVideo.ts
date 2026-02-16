import { TAudit } from "./TAudit";

export type TYoutubeVideo =  TAudit & {
    id: string;
    title: string;
    order:number,
    active:boolean
}