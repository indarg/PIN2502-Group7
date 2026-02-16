import { FormTMediaFile } from "./FormTMediaFile";
import { TAttribute } from "./TAttribute";
import { TMediaFile } from "./TMediaFile";

export type TProperty = {
    id: number;
    attributes:TAttribute[]
    image: TMediaFile;
}

export type FormTProperty = Omit<TProperty,'image'> & {
    image:FormTMediaFile
}