import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { TFeature } from 'src/models/TFeature';
import './FeaturesNestedForm.css';
import useObjectImageUploadV2 from 'src/shared/hooks/useObjectImageUploadV2';
import { FormTFeature, TReleaseForm } from 'src/forms/TReleaseForm';
type TProps = {
    control: Control<TReleaseForm>,
    parentField?: string,
    featuresCroppedImages: Record<string, string | null>,
    setFeaturesCroppedImages: (value: SetStateAction<Record<string, string | null>>) => void,
    featuresImageBlobMap: Record<string, Blob>,
    setFeaturesImageBlobMap: Dispatch<SetStateAction<Record<string, Blob>>>,
    setError: any,
    clearErrors: any,
    watch: any
}

const FeaturesNestedForm = ({ watch, clearErrors, setError, control, parentField = "features", featuresCroppedImages, setFeaturesCroppedImages, featuresImageBlobMap, setFeaturesImageBlobMap }: TProps) => {

    const featureFileUpload = useObjectImageUploadV2(featuresCroppedImages, setFeaturesCroppedImages, featuresImageBlobMap, setFeaturesImageBlobMap);
    const featuresFieldArray = useFieldArray({
        control,
        name: 'features',
        keyName: '_key',
    });
    const watchedFeatures = watch(parentField);

    const addFeature = () => {
        const tempId = Date.now() + Math.floor(Math.random() * 10);
        const newFeature: TFeature = {
            id: tempId,
            title: '',
            description: '',
            image: {
                id: tempId,
                fileUrl: '',
                title: '',
                mediaType: 'image',
                description: '',
                fileFormat: '',
                fileSize: 0,
            },
        };
        featuresFieldArray.append(newFeature);
    };

    const removeFeature = (index: number, id: number) => {
        featureFileUpload.removeImage(id);
        if (watchedFeatures[index]?.media?.preview) {
            URL.revokeObjectURL(watchedFeatures[index].media.preview);
        }
        featuresFieldArray.remove(index);
    };

    return (
        <section className='features-nested-form'>
            <div style={{ margin: "40px 0" }}>
                <Button color='secondary' variant='outlined' onClick={addFeature}>Agregar característica</Button>
            </div>
            <div>
                {featuresFieldArray.fields.map((field, index) => (
                    <Accordion defaultExpanded key={field.id}>
                        <AccordionSummary expandIcon={<GridExpandMoreIcon />} >
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "95%" }}>
                                <Typography>Característica {index + 1}</Typography>
                                <Button color='error' variant='contained' onClick={() => removeFeature(index, field.id)}>Eliminar característica</Button>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ColumnInput
                                key={field.id}
                                control={control}
                                index={index}
                                feature={watchedFeatures[index]}
                                onFileChange={(e, id) => {
                                    featureFileUpload.handleFileChange(e, field.id ?? 0);
                                }}
                                getDialogOpen={(id) => featureFileUpload.getDialogOpen(field.id ?? 0)}
                                onCropComplete={(blob, id) => {
                                    featureFileUpload.handleCropComplete(blob, field.id ?? 0);
                                }}
                                closeCropper={() => featureFileUpload.setDialogOpenMap((prev) => ({ ...prev, [field.id ?? 0]: false }))}
                                imageSrc={featureFileUpload.imageSrcMap[field.id ?? 0] || ''}
                                croppedImage={featuresCroppedImages[field.id ?? 0] || null}
                                clearErrors={clearErrors} setError={setError}
                            />
                        </AccordionDetails>
                    </Accordion>

                ))}

            </div>
        </section>
    );
};



export default FeaturesNestedForm;






import { Delete as DeleteIcon } from '@mui/icons-material';

import { ChangeEvent } from 'react';
import { useController } from 'react-hook-form';
import { Card, IconButton, } from '@mui/material';
import RichtextEditorV2 from '../richtext_editor/RichtextEditorV2';
import UploadFileBox from '../upload_file_box/UploadFileBox';



interface TFeatureInputProps {
    index: number;
    clearErrors: any,
    setError: any,
    onFileChange: (e: ChangeEvent<HTMLInputElement>, id: number) => void;
    feature: FormTFeature;
    getDialogOpen: (id: number) => boolean;
    onCropComplete: (blob: Blob, id: number) => void;
    closeCropper: () => void;
    imageSrc: string;
    croppedImage: string | null;
    control: Control<TReleaseForm>;

}


export const ColumnInput: React.FC<TFeatureInputProps> = ({
    control,
    index,
    onFileChange,
    feature,
    getDialogOpen,
    onCropComplete,
    closeCropper,
    imageSrc,
    croppedImage,
    setError,
    clearErrors,
}) => {
    const { field: titleField, fieldState: titleState } = useController({
        control,
        name: `features.${index}.title`,
        rules: { required: { value: true, message: "Campo requerido" }, maxLength: { value: 120, message: `Solo se admiten ${120} como máximo` } }
    });
    const { field: descriptionField, fieldState: descriptionState } = useController({
        control,
        name: `features.${index}.description`,
        rules: { maxLength: 200 }
    });


    const getPreviewUrl = () => {
        if (croppedImage) return croppedImage;
        if (feature.image.preview) return feature.image.preview;
        if (feature.image.fileUrl) return feature.image.fileUrl;
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
        <Card sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color={feature.image.isExisting ? 'primary' : 'secondary'}>
                    {feature.image.isExisting ? '📁 Característica existente' : '📄 Nueva característica'} #{index + 1}
                </Typography>

            </Box>

            <Box display="flex" gap={3}>
                <Box flex="0 0 300px">
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
                <Box flex={1}>
                    <Grid>
                        <TextField
                            {...titleField}
                            label="Titulo *"
                            fullWidth
                            margin="normal"
                            size="small"
                            error={!!titleState.error}
                            helperText={titleState.error?.message}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <Typography variant="subtitle1" color='info' >Cuerpo <small>Opcional</small></Typography>
                        <RichtextEditorV2
                            field={descriptionField}
                            error={descriptionState.error}
                            clearErrors={clearErrors}
                            setError={setError}
                            fieldName={descriptionField.name}
                            maxLength={750}
                            placeholder={"Ingrese texto"}
                        />
                    </Grid>
                    <Box mt={2} p={1} bgcolor="grey.50" borderRadius={1}>
                        <Typography variant="caption" color="textSecondary">
                            Estado: {feature.image.isExisting ? 'Medio existente' : 'Nueva carga'}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};