import { FormTMediaFile } from "src/models/FormTMediaFile";
import { TAudit } from "src/models/TAudit";
import { TColumn } from "src/models/TColumn";
import { TFeature } from "src/models/TFeature";
import { TRelease } from "src/models/TRelease";
import { FormTSerie } from "src/models/TSerie";

export type TReleaseForm = Partial<Omit<TRelease, keyof TAudit | 'columns' | 'series' | 'features' | 'images' | 'mainImage'>> & {
    columns: FormTColumn[],
    features:FormTFeature[],
    series: FormTSerie[],
    images:FormTMediaFile[],
    mainImage:FormTMediaFile
};

export type   FormTColumn = Omit<TColumn, 'image'> & {
  image: FormTMediaFile;
}


export type   FormTFeature = Omit<TFeature, 'image'> & {
  image: FormTMediaFile;
}

