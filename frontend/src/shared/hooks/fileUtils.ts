import { FormTMediaFile } from "src/models/FormTMediaFile";
import { TAd, TAdvertisement } from "src/models/TAdvertisement";
import { TMediaFile } from "src/models/TMediaFile";

// utils/fileUtils.ts
export const createPreviewUrl = (file: File | Blob): string => {
  return URL.createObjectURL(file);
};

export const revokePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};

export const convertToFormData = (advertisement: FormTAdvertisement): FormData => {
  const formData = new FormData();
  
  // Add basic fields
  formData.append('title', advertisement.title);
  formData.append('duration', advertisement.duration.toString());
  formData.append('active', advertisement.active.toString());
  formData.append('description', advertisement.description);
  
  // Add location
  formData.append('location', JSON.stringify(advertisement.location));
  
  // Handle ads array
  advertisement.ads.forEach((ad, index) => {
    // Add redirect URL for each ad if exists
    if (ad.redirectUrl) {
      formData.append(`ads[${index}].redirectUrl`, ad.redirectUrl);
    }
    
    // Handle media file for each ad
    const mediaFile = ad.media;
    
    if (mediaFile.file) {
      // New file to upload
      formData.append(`ads[${index}].media.file`, mediaFile.file);
      formData.append(`ads[${index}].media.data`, JSON.stringify({
        title: mediaFile.title,
        description: mediaFile.description,
        mediaType: mediaFile.mediaType,
        fileFormat: mediaFile.fileFormat,
        fileSize: mediaFile.fileSize,
      }));
    } else if (mediaFile.isExisting && mediaFile.id) {
      // Existing file to keep - send the complete media object
      formData.append(`ads[${index}].media.existing`, JSON.stringify({
        id: mediaFile.id,
        title: mediaFile.title,
        description: mediaFile.description,
        fileUrl: mediaFile.fileUrl,
        mediaType: mediaFile.mediaType,
        fileSize: mediaFile.fileSize,
        fileFormat: mediaFile.fileFormat,
      }));
    } else {
      // Media without file (shouldn't happen in normal flow, but handle gracefully)
      formData.append(`ads[${index}].media.data`, JSON.stringify({
        title: mediaFile.title,
        description: mediaFile.description,
        mediaType: mediaFile.mediaType,
      }));
    }
  });
  
  return formData;
};



export interface FormTAd {
  id?:number,
  media: FormTMediaFile;
  redirectUrl?: string;
}

export interface FormTAdvertisement extends Omit<TAdvertisement, 'id' | 'ads'> {
  id?: number;
  ads: FormTAd[];
  swap?:boolean
}