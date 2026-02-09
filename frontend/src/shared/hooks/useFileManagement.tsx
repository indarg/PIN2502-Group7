// hooks/useFileManager.ts
import { useState, useCallback, ChangeEvent } from 'react';
import { UseFieldArrayReturn } from 'react-hook-form';
import { FormTAdvertisement } from './fileUtils';
import CRMStorageService, { TFile } from 'src/services/CRMStorageService';

interface UseFileManagerProps {
  fieldArray: UseFieldArrayReturn<FormTAdvertisement, 'ads'>;
}

export const useFileManager = ({ fieldArray }: UseFileManagerProps) => {
  const [fileAsBlob, setFileAsBlob] = useState<Blob | null>(null);
  const storageService = new CRMStorageService();
  const [cropperState, setCropperState] = useState<{
    open: boolean;
    imageSrc: string;
    fileIndex: number;
    tempFile: File | null;
  }>({
    open: false,
    imageSrc: '',
    fileIndex: -1,
    tempFile: null,
  });

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageSrc = createPreviewUrl(file);
      setCropperState({
        open: true,
        imageSrc,
        fileIndex: index,
        tempFile: file,
      });
    }
  }, []);

  const handleCropComplete = useCallback((croppedBlob: Blob) => {
    const { fileIndex } = cropperState;
    if (fileIndex >= 0) {
      setFileAsBlob(croppedBlob);
      const preview = createPreviewUrl(croppedBlob);
      
      // Get current ad and update only the media part
      const currentAd = fieldArray.fields[fileIndex];
      const newName = (Date.now() + Math.floor(Math.random() * 10)).toString();
      fieldArray.update(fileIndex, {
        ...currentAd,
        media: {
          ...currentAd.media,
          file: croppedBlob,
          preview,
          isExisting: false,
          mediaType: 'image',
          // Preserve existing media info if updating
          title: currentAd.media.title || newName,
          description: currentAd.media.description || `Imagen de: ${currentAd.media.title || newName}` ,
        }
      });
    }
    
    setCropperState(prev => ({ ...prev, open: false }));
  }, [cropperState.fileIndex, fieldArray]);

  const closeCropper = useCallback(() => {
    if (cropperState.imageSrc) {
      revokePreviewUrl(cropperState.imageSrc);
    }
    setCropperState({
      open: false,
      imageSrc: '',
      fileIndex: -1,
      tempFile: null,
    });
  }, [cropperState.imageSrc]);

  const addNewAd = useCallback(() => {
    fieldArray.append({
      media: {
        title: '',
        description: '',
        mediaType: 'image',
        isExisting: false,
      },
      redirectUrl: '',
    });
  }, [fieldArray]);

  const removeAd = useCallback((index: number) => {
    const ad = fieldArray.fields[index];
    // Clean up preview URL if it exists
    if (ad.media.preview) {
      revokePreviewUrl(ad.media.preview);
    }
    fieldArray.remove(index);
  }, [fieldArray]);
  const saveImages = async (imageSubName = (Date.now() + Math.floor(Math.random() * 10)).toString()): Promise<TFile | null> => {
    const formData = new FormData();
    if (fileAsBlob) {
      const fileName = imageSubName.replace(/\s/g, "_").toLowerCase();
      formData.append('file', fileAsBlob, `${fileName}`);
      formData.append('title', fileName);
      formData.append('media_type', 'image');
      const response = await storageService.uploadFile(formData, true)
      return response.payload;

    }
    return null;
  }


  return {
    cropperState,
    handleFileChange,
    handleCropComplete,
    closeCropper,
    addNewAd,
    removeAd,
    saveImages,
    fileAsBlob
  };
};

// Utility functions
export const createPreviewUrl = (file: File | Blob): string => {
  return URL.createObjectURL(file);
};

export const revokePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};