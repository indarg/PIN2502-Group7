import { TMediaFile } from "./TMediaFile";

export type TFeatureLite = {
    id:number,
    title: string;
    description: string;
}

export type TFeature = TFeatureLite &{
    image: TMediaFile;
}

export type TFeatureLiteWithIcon = {
    id:number,
    title: string;
    description: string;
    icon?:string;
}
