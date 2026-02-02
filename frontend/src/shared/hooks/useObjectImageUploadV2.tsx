import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { TResponse } from "src/models/response/TResponses";
import CRMStorageService, { TFile } from "src/services/CRMStorageService";

type TReturnProps = {
  imageSrcMap: Record<number, string>;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>, id: number) => void;
  handleCropComplete: (blob: Blob, id: number) => void;
  removeImage: (id: number) => void;
  getDialogOpen: (id: number) => boolean;
  setDialogOpenMap: Dispatch<SetStateAction<Record<number, boolean>>>;
  dialogOpenMap: Record<number, boolean>;
  saveFiles: (existingImages?: Map<number, string>) => Promise<Map<number, TResponse<TFile>>>;
};

const useObjectImageUploadV2 = (
  croppedImageMap: Record<number, string | null>,
  setCroppedImageMap: Dispatch<SetStateAction<Record<number, string | null>>>,
  fileAsBlobMap: Record<number, Blob>,
  setFileAsBlobMap: Dispatch<SetStateAction<Record<number, Blob>>>
): TReturnProps => {
  const [imageSrcMap, setImageSrcMap] = useState<Record<number, string>>({});
  const [dialogOpenMap, setDialogOpenMap] = useState<Record<number, boolean>>({});
  const storageService = new CRMStorageService();

  useEffect(() => {
  }, [croppedImageMap, dialogOpenMap, imageSrcMap]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrcMap(prev => ({ ...prev, [id]: reader.result as string }));
      setDialogOpenMap(prev => ({ ...prev, [id]: true }));
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (blob: Blob, id: number) => {
    const url = URL.createObjectURL(blob);
    setCroppedImageMap(prev => ({ ...prev, [id]: url }));
    setFileAsBlobMap(prev => ({ ...prev, [id]: blob }));
    setDialogOpenMap(prev => ({ ...prev, [id]: false }));
    
  };

  const saveFiles = async (
    existingImages?: Map<number, string>
  ): Promise<Map<number, TResponse<TFile>>> => {
    const responses = new Map<number, TResponse<TFile>>();

    for (const idStr in fileAsBlobMap) {
      const id = Number(idStr);
      const blob = fileAsBlobMap[id];
      if (!blob) continue;
      // const imageSubName = (imagesNames && id in imagesNames) ? imagesNames[id] : (Date.now() + Math.floor(Math.random() * 10)).toString();
      const imageSubName = existingImages?.get(id) ?? (Date.now() + Math.floor(Math.random() * 10)).toString();
      
      const formData = new FormData();
      const fileName = imageSubName.replace(/\s/g, "_").toLowerCase();
      formData.append("file", blob, `${fileName}`);
      formData.append("title", fileName);
      formData.append("media_type", "image");

      const res = await storageService.uploadFile(formData, true);
      responses.set(id, res);
    }

    return responses;
  };

  const removeImage = (id: number) => {
    setImageSrcMap(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setCroppedImageMap(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setDialogOpenMap(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setFileAsBlobMap(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const getDialogOpen = (id: number): boolean => dialogOpenMap[id] ?? false;

  return {
    imageSrcMap,
    handleFileChange,
    handleCropComplete,
    removeImage,
    getDialogOpen,
    setDialogOpenMap,
    dialogOpenMap,
    saveFiles,
  };
};

export default useObjectImageUploadV2;
