import { FormTMediaFile } from "src/models/FormTMediaFile";
import { TAudit } from "src/models/TAudit";
import { TTeaser } from "src/models/TTeaser";
import { FormTColumn } from "./TReleaseForm";
import { FormTProperty } from "src/models/TProperty";



export type TTeaserForm = Partial<Omit<TTeaser, keyof TAudit | 'images' | 'mainImage' | 'properties' | 'bodyImage'>> & {
    properties: FormTProperty[]
    images: FormTMediaFile[],
    mainImage: FormTMediaFile,
    bodyImage: FormTMediaFile
};

