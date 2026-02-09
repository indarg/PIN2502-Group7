import { TColumn } from "./TColumn";
import { TNote } from "./TNote";

export type TNews  = TNote &{
    columns:TColumn[];
    isDeleted:boolean;
    deletedAt?:string;
}

