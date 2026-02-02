import { FormTMediaFile } from "src/models/FormTMediaFile";
import { TAudit } from "src/models/TAudit";
import { TNews } from "src/models/TNews";
import { FormTColumn } from "./TReleaseForm";

export type TNewsForm = Partial<Omit<TNews, keyof TAudit | 'images' | 'mainImage'| 'columns'>> & {
    mainImage:FormTMediaFile
    images:FormTMediaFile[],
    columns: FormTColumn[],
}





