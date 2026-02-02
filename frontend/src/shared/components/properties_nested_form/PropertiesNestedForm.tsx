import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, Stack, Typography } from '@mui/material';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Control, useController, useFieldArray, useFormContext } from 'react-hook-form';
import { FormTProperty, TProperty } from 'src/models/TProperty';
import UtilService from 'src/services/UtilService';
import useObjectImageUpload from 'src/shared/hooks/useObjectImageUpload';
import AttributesNestedForm from '../attributes_nested_form/AttributesNestedForm';
import UploadFileBox from '../upload_file_box/UploadFileBox';
import './PropertiesNestedForm.css';
import { TTeaserForm } from 'src/forms/TTeaserForm';
import useObjectImageUploadV2 from 'src/shared/hooks/useObjectImageUploadV2';
type TProps = {
    control: Control<TTeaserForm>,
    setPropertiesCroppedImages: Dispatch<SetStateAction<Record<string, string | null>>>,
    propertiesImageBlobMap: Record<string, Blob>,
    propertiesCroppedImages: Record<string, string | null>,
    setPropertiesImageBlobMap: Dispatch<SetStateAction<Record<string, Blob>>>,
    setError: any,
    clearErrors: any,
    watch: any,
}

const PropertiesNestedForm = ({ watch, clearErrors, setError, propertiesCroppedImages, setPropertiesCroppedImages, propertiesImageBlobMap, setPropertiesImageBlobMap, control }: TProps) => {

    const { fields, append, remove } = useFieldArray({
        control,
        name: `properties`,
        keyName: '_key'
    });

    const propertiesFileUpload = useObjectImageUploadV2(propertiesCroppedImages, setPropertiesCroppedImages, propertiesImageBlobMap, setPropertiesImageBlobMap);
    const watchedProperties = watch('properties');
    useEffect(() => {
    }, [])
    const addProperty = () => {
        const newProperty: TProperty = {
            id: Date.now() + Math.floor(Math.random() * 10),
            attributes: [],
            image: {
                id: Date.now() + Math.floor(Math.random() * 10),
                fileUrl: '',
                title: '',
                mediaType: 'image',
                fileFormat: '',
                fileSize: 0,
            }
        };
        append(newProperty);
    };



    const removeProperty = (index: number) => {
        const property = fields[index] as unknown as TProperty & { fieldId: string };
        propertiesFileUpload.removeImage(property.id);
        remove(index);
    };





    return (
        <section className='properties-nested-form'>
            <div style={{ margin: "40px 0" }}>
                <Button color='secondary' variant='outlined' onClick={addProperty}>
                    Agregar Propiedad
                </Button>
            </div>
            <div>
                {fields && fields.map((field, index) => {

                    return (
                        <PropertyItem
                            removeProperty={removeProperty}
                            key={field.id}
                            control={control}
                            index={index}
                            property={watchedProperties[index]}
                            onFileChange={(e, id) => {
                                propertiesFileUpload.handleFileChange(e, field.id ?? 0);
                            }}
                            getDialogOpen={(id) => propertiesFileUpload.getDialogOpen(field.id ?? 0)}
                            onCropComplete={(blob, id) => {
                                propertiesFileUpload.handleCropComplete(blob, field.id ?? 0);
                            }}
                            closeCropper={() => propertiesFileUpload.setDialogOpenMap((prev) => ({ ...prev, [field.id ?? 0]: false }))}
                            imageSrc={propertiesFileUpload.imageSrcMap[field.id ?? 0] || ''}
                            croppedImage={propertiesCroppedImages[field.id ?? 0] || null}
                            clearErrors={clearErrors} setError={setError} />
                    );
                })}
            </div>
        </section>
    );
};



export default PropertiesNestedForm;



interface TSerieItemProps {
    index: number;
    clearErrors: any,
    setError: any,
    onFileChange: (e: ChangeEvent<HTMLInputElement>, id: number) => void;
    property: FormTProperty;
    getDialogOpen: (id: number) => boolean;
    onCropComplete: (blob: Blob, id: number) => void;
    closeCropper: () => void;
    imageSrc: string;
    croppedImage: string | null;
    control: Control<TTeaserForm>;
    removeProperty: (id: number) => void

}

export const PropertyItem: React.FC<TSerieItemProps> = ({
    control,
    index,
    onFileChange,
    property,
    getDialogOpen,
    onCropComplete,
    closeCropper,
    imageSrc,
    croppedImage,
    setError,
    clearErrors,
    removeProperty
}) => {

    const getPreviewUrl = () => {
        if (croppedImage) return croppedImage;
        if (property.image.preview) return property.image.preview;
        if (property.image.fileUrl) return property.image.fileUrl;
        return '';
    };

    const handleFileChangeWrapper = (e: ChangeEvent<HTMLInputElement>) => {
        onFileChange(e, index);
    };

    const handleCropCompleteWrapper = (blob: Blob) => {
        onCropComplete(blob, index);
    };

    const previewUrl = getPreviewUrl();

    return (
        <Accordion defaultExpanded >
            <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "95%" }}>
                    <Typography variant='h5'>Propiedad {index + 1}</Typography>
                    <Button
                        color='error'
                        variant='contained'
                        onClick={(e) => {
                            e.stopPropagation();
                            removeProperty(index);
                        }}
                    >
                        Eliminar Propiedad
                    </Button>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Stack direction={"row"} spacing={1} py={5} flexWrap={"wrap"}>
                    <Box width={"40%"} minWidth={360}>
                        <UploadFileBox
                            croppedImage={previewUrl}
                            handleFileChange={handleFileChangeWrapper}
                            open={getDialogOpen(index)}
                            close={closeCropper}
                            onCropComplete={handleCropCompleteWrapper}
                            imageSrc={imageSrc}
                            cropType="square"
                        />
                    </Box>
                    <Box width={"55%"} minWidth={360}>
                        <AttributesNestedForm
                            parentIndex={index}
                            maxLengthDescription={200}
                            clearErrors={clearErrors}
                            setError={setError}
                            control={control} />
                    </Box>
                </Stack>
            </AccordionDetails>
        </Accordion>

    );
};

