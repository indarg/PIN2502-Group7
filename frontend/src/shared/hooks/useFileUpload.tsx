import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import CRMStorageService, { TFile } from "src/services/CRMStorageService";
type TReturnProps = [
    string, Dispatch<SetStateAction<string>>, string | null, Dispatch<SetStateAction<string | null>>, boolean, Dispatch<SetStateAction<boolean>>, (e: ChangeEvent<HTMLInputElement>) => void, (blob: Blob) => void, (imageSubName?: string) => Promise<TFile | null>, Blob | null
]
const useFileUpload = (cachedImage = ""): TReturnProps => {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [croppedImage, setCroppedImage] = useState<string | null>(cachedImage);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [fileAsBlob, setFileAsBlob] = useState<Blob | null>(null);
    const storageService = new CRMStorageService()
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result as string);
                setDialogOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = async (blob: Blob) => {
        setFileAsBlob(blob);
        const url = URL.createObjectURL(blob);
        setCroppedImage(url);
    };

    const saveImage = async (imageSubName = (Date.now() + Math.floor(Math.random() * 10)).toString()): Promise<TFile | null> => {
        const formData = new FormData();
        if (fileAsBlob) {
            const fileName = imageSubName.replace(/\s/g, "_").toLowerCase();
            formData.append('file', fileAsBlob, `${fileName}`);
            formData.append('title', fileName);
            formData.append('media_type', 'image');
            const response = await storageService.uploadFile(formData,true)
            return response.payload;

        }
        return null;
    }


    return [imageSrc, setImageSrc, croppedImage, setCroppedImage, dialogOpen, setDialogOpen, handleFileChange, handleCropComplete, saveImage, fileAsBlob]
}

export default useFileUpload;

