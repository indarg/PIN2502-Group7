import { TAttribute } from './TAttribute';
import { TColumn } from './TColumn';
import { TFeature } from './TFeature';
import { TNote } from './TNote';
import { TSerie } from './TSerie';

export type TRelease = TNote & {
    name: string;
    segment:string,
    shape:string,
    series: TSerie[];
    columns: TColumn[];
    features: TFeature[];
    qualities:TAttribute[];
    extras:string;
    isDeleted:boolean;
    deletedAt?:string,
}