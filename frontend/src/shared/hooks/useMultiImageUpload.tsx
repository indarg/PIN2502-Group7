import { ChangeEvent, useState } from 'react';
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
import { TNewsForm } from 'src/forms/TNewsForm';
import { TResponse } from 'src/models/response/TResponses';
import { DELETE_MEDIA_FILES_PROBLEM } from 'src/models/TMediaFile';
import CRMStorageService, { TFile } from 'src/services/CRMStorageService';

export type TImagePreview = {
  id?: number,
  name: string;
  src: string;
};

const useMultiImageUpload = (storedImages: TImagePreview[]): [TImagePreview[], (e: ChangeEvent<HTMLInputElement>) => void, (name: string) => void, (imagesToSave?: TImagePreview[], imageSubName?: string) => Promise<TResponse<TFile>[]>, Set<number>, () => Promise<void>] => {
  const [images, setImages] = useState<TImagePreview[]>(storedImages);
  const [imagesToDelete, setImagesToDelete] = useState<Set<number>>(new Set<number>());
  const storageService = new CRMStorageService()
  const { setSnackbarMessage } = useCRMCommon();
  const handleMultiImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray: TImagePreview[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        fileArray.push({ name: file.name, src: reader.result as string });

        if (fileArray.length === files.length) {
          setImages((prev) => [...prev, ...fileArray]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = async (name: string, id?: number) => {
    try {
      if (id) {
        imagesToDelete.add(id)
        setImagesToDelete(imagesToDelete);
      }
      setImages((prev) => prev.filter((img) => img.name !== name));

    } catch (e) {
      setSnackbarMessage(DELETE_MEDIA_FILES_PROBLEM)
    }

  };
  const deleteImagesFromStorage = async () => {
    for (const imageId of imagesToDelete) {
      try {
        const response = await storageService.deleteFile(imageId.toString());

      } catch (error) {
        setSnackbarMessage(DELETE_MEDIA_FILES_PROBLEM);
        return;

      }

    }


  }

  const saveImages = async (imagesToSave = images, imageSubName = (Date.now() + Math.floor(Math.random() * 10)).toString()): Promise<TResponse<TFile>[]> => {
    const responses: TResponse<TFile>[] = [];

    for (const image of imagesToSave) {
      const formData = new FormData();
      const blob = dataURLtoBlob(image.src);
      const fileName = imageSubName ? imageSubName.replace(/\s/g, "_").toLowerCase().concat('_' + image.name.replace(/\s/g, "_").toLowerCase()) : 'uploaded_image'
      formData.append('file', blob, `${fileName}.webp`);
      formData.append('title', fileName);
      formData.append('media_type', 'image');

      try {
        const res = await storageService.uploadFile(formData);
        responses.push(res);
      } catch (error) {
        console.error('Error uploading image:', image.name, error);
      }
    }
    return responses;
  };

  // 🔁 Conversor de base64 a Blob
  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  };

  return [
    images,
    handleMultiImageChange,
    removeImage,
    saveImages,
    imagesToDelete,
    deleteImagesFromStorage
  ];
};

export default useMultiImageUpload;
