import { TAudit } from "./TAudit";
import { TMediaFile } from "./TMediaFile";

export type TAdvertisement =  TAudit & {
    id: number;
    title: string;
    duration:number;
    active:boolean;
    description:string;
    location:TAdvertisementLocation,
    ads:TAd[],
}

export type TAdvertisementLocation =  {
    id: number;
    name: string;
    description:string;
    maxAmountAds:number;
}

export type TAd = {
    id?:number,
    media: TMediaFile,
    redirectUrl?: string
}