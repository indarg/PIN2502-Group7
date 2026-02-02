import { ChangeEvent, useState } from 'react'
import UtilService from 'src/services/UtilService'
import CircularCropImageTool from '../circular_crop_image_tool/CircularCropImageTool'
import { CropImageTool } from '../crop_image_tool/CropImageTool'
import InputFileUpload from '../file_upload_input/FileUploadInput'
import './UploadFileBox.css'

type Props = {
    croppedImage: string,
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void,
    open: boolean,
    close: () => void,
    onCropComplete: (croppedImage: Blob) => void,
    imageSrc: string,
    cropType?: 'square' | 'circle'

}

export default function UploadFileBox({ croppedImage, handleFileChange, open, close, onCropComplete, imageSrc, cropType = 'square' }: Props) {
     const [fileType, setFileType] = useState<string>('');
    const handleFileChangeWithType = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileType(file.type);
        }
        handleFileChange(e);
    };
    const isGif = fileType === 'image/gif';
 
    return (
        <div className='upload-file-box'>
            <section>
                <div>
                    {croppedImage && <img src={UtilService.resolveFile(croppedImage)} alt='imagen' />}
                </div>
                <InputFileUpload handleFileChange={handleFileChangeWithType} />
            </section>
            {cropType === 'square' ? 
                <CropImageTool
                    open={open}
                    imageSrc={imageSrc}
                    onClose={close}
                    onCropComplete={onCropComplete}
                    isGif={isGif}
                /> : 
                <CircularCropImageTool
                    open={open}
                    imageSrc={imageSrc}
                    onClose={close}
                    onCropComplete={onCropComplete}
                />
            }
        </div>
    )
}