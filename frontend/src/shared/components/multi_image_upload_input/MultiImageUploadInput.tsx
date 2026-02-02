import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { ChangeEvent, FC } from 'react';
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
import { TImagePreview } from 'src/shared/hooks/useMultiImageUpload';
import './MultiImageUploadInput.css';


interface MultiImageUploadInputProps {
    images: TImagePreview[]
    handleMultiImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
    removeImage: (name: string,id?:number) => void;

}

const MultiImageUploadInput: FC<MultiImageUploadInputProps> = ({
    images,
    handleMultiImageChange,
    removeImage,
}) => {
    const {setConfirmationModal} = useCRMCommon();

    return (
        <Box>
            <Button variant="contained" component="label">
                Cargar imágenes
                <input
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={handleMultiImageChange}
                />
            </Button>

            <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                {images.map((image) => (
                    <Box
                        key={image.name}
                        position="relative"
                        border="1px solid #ccc"
                        borderRadius={2}
                        overflow="hidden"
                        width={120}
                        height={120}
                    >
                        <img
                            src={image.src}
                            alt={image.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <IconButton
                            onClick={() => setConfirmationModal({
                                action: () => removeImage(image.name,image.id),
                                show: true
                            })}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                background: 'rgba(0,0,0,0.5)',
                                color: 'white',
                            }}
                            size="small"
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ))}
            </Box>

            {images.length === 0 && (
                <Typography mt={2} variant="body2" color="text.secondary">
                    No se han seleccionado imágenes.
                </Typography>
            )}
        </Box>
    );
};

export default MultiImageUploadInput;
