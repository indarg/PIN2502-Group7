import { FormTMediaFile } from './FormTMediaFile';
import {  TFeatureLiteWithIcon } from './TFeature';
import { TMediaFile } from './TMediaFile';

export type TSerie = {
    id: number;
    name: string;
    details: string;
    price?: string;
    currency?:TCurrency;
    mainImage: TMediaFile;
    features?: TFeatureLiteWithIcon[];
}


export type TCurrency = {
    id:number,
    name:string,
    code:string
}



export type FormTSerie = Omit<TSerie,'mainImage'> & {
    mainImage: FormTMediaFile;
}


