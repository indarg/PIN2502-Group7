import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { TResponse } from "src/models/response/TResponses";
import CRMStorageService, { TFile } from "src/services/CRMStorageService";
type TReturnProps = [
    Record<number, string>,
    (e: ChangeEvent<HTMLInputElement>, id: number) => void,
    (blob: Blob, id: number) => void,
    (id: number) => void,
    (id: number) => boolean,
    Dispatch<SetStateAction<Record<number, boolean>>>,
    Record<number, boolean>,
    (imageSubName?: string) => Promise<Map<string, TResponse<TFile>>>
]
const useObjectImageUpload = (croppedImageMap: Record<string, string | null>, setCroppedImageMap: Dispatch<SetStateAction<Record<string, string | null>>>, fileAsBlobMap: Record<string, Blob> , setFileAsBlobMap: Dispatch<SetStateAction<Record<string, Blob>>>): TReturnProps => {
    const [imageSrcMap, setImageSrcMap] = useState<Record<string, string>>({});
    const [dialogOpenMap, setDialogOpenMap] = useState<Record<string, boolean>>({});

    const storageService = new CRMStorageService()
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

    const saveFiles = async (imageSubName = (Date.now() + Math.floor(Math.random() * 10)).toString()): Promise<Map<string, TResponse<TFile>>> => {
        const responses = new Map<string, TResponse<TFile>>();

        for (const id in fileAsBlobMap) {
            const blob = fileAsBlobMap[id];
            if (!blob) continue;

            const formData = new FormData();
            const fileName = imageSubName?.replace(/\s/g, "_").toLowerCase().concat('_column');
            formData.append('file', blob, `${fileName}-${id}.webp`);
            formData.append('title', fileName);
            formData.append('media_type', 'image');
            const res = await storageService.uploadFile(formData, true);
            responses.set(id, res);
        }

        return responses;
    };
    const removeColumn = (id: number) => {
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

    const getDialogOpen = (id: number): boolean => {
        return dialogOpenMap[id] ?? false;
    };

    return [imageSrcMap,
        handleFileChange,
        handleCropComplete,
        removeColumn,
        getDialogOpen,
        setDialogOpenMap,
        dialogOpenMap,
        saveFiles
    ]
}

export default useObjectImageUpload;