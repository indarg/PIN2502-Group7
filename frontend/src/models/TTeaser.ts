import { TMediaFile } from './TMediaFile';
import { TNote } from './TNote';
import { TProperty } from './TProperty';

export type TTeaser = TNote & {
    name: string;
    subHeadline: string;
    subBody: string;
    bodyImage: TMediaFile;
    segment: string,
    shape: string,
    launchDate?:string,
    properties: TProperty[];
    availableFrom: string;
    isDeleted:boolean;
    deletedAt?:string;
}