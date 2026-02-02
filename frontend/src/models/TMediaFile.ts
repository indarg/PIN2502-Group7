import { FormTMediaFile } from "./FormTMediaFile";
import TSnackbarMessage from "./TSnackbarMessage";

export type TMediaFile = {
    id: number;
    title: string;
    description?: string;
    fileUrl: string;
    mediaType: 'image' | 'video' | 'audio' | 'document' | 'other';
    fileSize?: number;
    fileFormat?: string;
};

export const initMediaFile = (id: number, fileUrl: string, title: string,
    description: string,
    fileFormat: string,
    fileSize: number, mediaType = 'image', isExisting = false): FormTMediaFile => {
    return {
        id,
        fileUrl,
        title,
        mediaType,
        description,
        fileFormat,
        fileSize,
        isExisting
    } as FormTMediaFile
}
export const UPLOAD_MEDIA_ADVERTISEMENT: TSnackbarMessage = {
    title: 'Ha ocurrido un problema',
    message: 'La imagen no pudo ser cargada, la publicidad se marcará como no publicada. Por favor, carge la imagen editando la misma luego.',
    duration: 4000,
    severity: 'error',
    show: true
}
export const UPLOAD_MAIN_IMAGE_PROBLEM: TSnackbarMessage = {
    title: 'Ha ocurrido un problema',
    message: 'La imagen principal no pudo ser cargada, la noticia se marcará como no publicada. Por favor, carge la imagen editando la misma luego.',
    duration: 4000,
    severity: 'error',
    show: true
}
export const UPLOAD_INFO_IMAGE_PROBLEM: TSnackbarMessage = {
    title: 'Ha ocurrido un problema',
    message: 'La imagen de la información no pudo ser cargada, el adelanto  se marcará como no publicado. Por favor, carge la imagen editando la misma luego.',
    duration: 4000,
    severity: 'error',
    show: true
}
export const UPLOAD_MAIN_IMAGE_PROBLEM_TEASER: TSnackbarMessage = {
    title: 'Ha ocurrido un problema',
    message: 'La imagen principal no pudo ser cargada, el adelanto se marcará como no publicado. Por favor, carge la imagen editando la misma luego.',
    duration: 4000,
    severity: 'error',
    show: true
}

export const UPLOAD_COLUMN_IMAGES_PROBLEM: TSnackbarMessage = {
    title: 'Ha ocurrido un problema',
    message: 'Algunas de las imágenes subidas para las columnas no se ha subido correctamente. Por favor, verifique luego la galeria ingresando a la noticia.',
    duration: 4000,
    severity: 'error',
    show: true
}

export const UPLOAD_ADD_IMAGE_PROBLEM = 'Algunas de las imágenes subidas para las publicidades no se ha subido correctamente. Por favor, verifique luego la publicidad.';

export const UPLOAD_PROPERTY_IMAGES_PROBLEM: TSnackbarMessage = {
    title: 'Ha ocurrido un problema',
    message: 'Algunas de las imágenes subidas para las propiedades no se ha subido correctamente. Por favor, verifique luego la galeria ingresando a la adelanto.',
    duration: 4000,
    severity: 'error',
    show: true
}

export const UPLOAD_FEAT_IMAGES_PROBLEM: TSnackbarMessage = {
    title: 'Ha ocurrido un problema',
    message: 'Algunas de las imágenes subidas para las características no se ha subido correctamente. Por favor, verifique luego la galeria ingresando al lanzamiento.',
    duration: 4000,
    severity: 'error',
    show: true
}
export const UPLOAD_MEDIA_FILES_PROBLEM: TSnackbarMessage = {
    title: 'Ha ocurrido un problema',
    message: 'Algunas de las imágenes subidas para la galería no se ha subido correctamente. Por favor, verifique luego la galeria ingresando a la noticia.',
    duration: 4000,
    severity: 'error',
    show: true
}

export const DELETE_MEDIA_FILES_PROBLEM: TSnackbarMessage = {
    title: 'Ha ocurrido un problema',
    message: 'Hubo un problema al intentar eliminar la imagen. Por favor, verifique luego si sigue existiendo o contacte a soporte.',
    duration: 4000,
    severity: 'error',
    show: true
}