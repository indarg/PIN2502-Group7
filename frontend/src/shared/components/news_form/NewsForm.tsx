import { Box, Card, CardContent, FormControlLabel, Grid, Stack, Switch, TextField, Typography } from '@mui/material';
import { Dispatch, FC, useEffect, useState } from 'react';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import "react-quill/dist/quill.snow.css";
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
import { useCRMNews } from 'src/context/CRMNewsContext/useCRMNews';
import { TNewsForm } from 'src/forms/TNewsForm';
import { FormTMediaFile } from 'src/models/FormTMediaFile';
import { initMediaFile, UPLOAD_MAIN_IMAGE_PROBLEM, UPLOAD_MEDIA_FILES_PROBLEM } from 'src/models/TMediaFile';
import { TNews } from 'src/models/TNews';
import { resolveErrorMessage } from 'src/models/TSnackbarMessage';
import CRMNewsService from 'src/services/CRMNewsService';
import CRMStorageService from 'src/services/CRMStorageService';
import UtilService from 'src/services/UtilService';
import useFileUpload from 'src/shared/hooks/useFileUpload';
import useMultiImageUpload from 'src/shared/hooks/useMultiImageUpload';
import useObjectImageUploadLoaders from 'src/shared/hooks/useObjectImageUploadLoaders';
import useObjectImageUploadV2 from 'src/shared/hooks/useObjectImageUploadV2';
import { FORM_NEWS_TEMPLATE } from 'src/static/templates';
import ColumnsNestedFormNews from '../columns_nested_form/ColumnsNestedFormNews';
import HorizontalStepper from '../horizontal-stepper/HorizontalStepper';
import MultiImageUploadInput from '../multi_image_upload_input/MultiImageUploadInput';
import RichtextEditorV2 from '../richtext_editor/RichtextEditorV2';
import SuccessBox from '../success_box/SuccessBox';
import TagsNestedForm from '../tags_nested_form/TagsNestedForm';
import UploadFileBox from '../upload_file_box/UploadFileBox';
import './NewsForm.css';
type TProps = {
    initialData?: TNews,
    mode: 'create' | 'update',
    setUpdatedNews?: Dispatch<React.SetStateAction<TNews | undefined>>
}


const NewsForm: FC<TProps> = ({ mode, initialData = Object.assign(FORM_NEWS_TEMPLATE, {}), setUpdatedNews }) => {
    const { addNews } = useCRMNews();
    const { setSnackbarMessage, hash, setLoading, setChangesMade } = useCRMCommon();
    const [success, setSuccess] = useState<boolean>(false);
    const [createdNewsId, setCreatedNewsId] = useState<number>(-1);
    const [columnsImages, setColumnsImages, setCroppedColumnImages, croppedColumnImages] = useObjectImageUploadLoaders()
    const columnsFileUpload = useObjectImageUploadV2(croppedColumnImages, setCroppedColumnImages, columnsImages, setColumnsImages);
    const [mainImageSrc, setMainImageSrc, croppedMainImage, setMainCroppedImage, mainImageDialogOpen, setMainImageDialogOpen, handleMainFileChange, handleMainImageCropComplete, saveMainImage, mainImageBlob] = useFileUpload(UtilService.resolveFile(initialData.mainImage?.fileUrl) ?? null);
    const {
        handleSubmit,
        reset,
        control,
        formState: { errors, isDirty },
        setValue,
        watch,
        getValues,
        setError,
        clearErrors,
    } = useForm<TNewsForm>({ defaultValues: initialData, mode: "all" });
    const [images,
        handleMultiImageChange,
        removeImage, saveGaleryImages, galeryImagesToDelete, removeImagesGaleryFromStorage] = useMultiImageUpload(initialData && initialData.images ? initialData.images.map((i) => { return { id: i.id, name: i.title, src: UtilService.resolveFile(i.fileUrl) } }) : []);

    const imagesUploadRollback = (data: TNewsForm) => {
        const storageService = new CRMStorageService();
        const { mainImage, columns, images } = data;
        const filesToDelete = [];
        try {
            !mainImage.isExisting && mainImage.fileUrl && filesToDelete.push(mainImage.fileUrl);
            if (columns && columns.length > 0) {
                for (const column of columns)
                    column.image?.fileUrl && !column.image.isExisting && filesToDelete.push(column.image.fileUrl);
            }
            if (images && images.length > 0) {
                for (const image of images)
                    image?.fileUrl && !image.isExisting && filesToDelete.push(image.fileUrl);
            }
            if (filesToDelete.length > 0)
                storageService.deleteFileByNameBulk(filesToDelete);
        }
        catch (error) {
            console.log(error);
        }
    }
    const onSubmit: SubmitHandler<TNewsForm> = async (data) => {
        const newsService = new CRMNewsService();
        if (!data.headline) {
            setSnackbarMessage(resolveErrorMessage("El título no puede estar vacío"))
            return;
        }
        if (data.published) {
            if (!data.lead || UtilService.getPlainText(data.lead) === '') {
                setSnackbarMessage(resolveErrorMessage('El encabezado no puede estar vacío si la noticia esta marcada para publicar'))
                return;
            }
            if (!data.body || UtilService.getPlainText(data.body) === '') {
                setSnackbarMessage(resolveErrorMessage('El cuerpo no puede estar vacío si la noticia esta marcada para publicar'))
                return;
            }
            if ((mode === 'update' && (!data.mainImage || data.mainImage?.fileUrl === '') && !mainImageBlob) || (mode === 'create' && !mainImageBlob)) {
                setSnackbarMessage(resolveErrorMessage('La imagen principal no puede estar vacía si la noticia esta marcada para publicar'))
                return;
            }

            if (!data.columns || data.columns.length === 0) {
                setSnackbarMessage(resolveErrorMessage('La noticia por lo menos debe incluir una columna'))
                return;
            } else if (data.columns.length > 0) {
                for (const column of data.columns) {
                    if (column.title === '' || UtilService.getPlainText(column.body) === '' || (!column.image.fileUrl && !columnsImages[column.id])) {
                        setSnackbarMessage(resolveErrorMessage('Cada columna añadida debe estar completamente rellenada'));
                        return;
                    }
                }

            }
        }
        setLoading(true);
        if (mainImageBlob) {
            const isMainImageSaved = await saveMainImage(mode === 'update' ? initialData.mainImage?.fileUrl?.split('images/')[1] : undefined);
            if (isMainImageSaved) {
                data.mainImage = initMediaFile(data.mainImage?.id ?? 0,
                    isMainImageSaved.fileUrl,
                    `${data.headline} - imagen principal`,
                    `${data.headline} - descripción`,
                    isMainImageSaved.fileFormat,
                    isMainImageSaved.fileSize)
            } else
                setSnackbarMessage(UPLOAD_MAIN_IMAGE_PROBLEM)
        }

        const columnBlobImagesSaved = await columnsFileUpload.saveFiles(
            UtilService.mapObjectIdToFileUrl(data.columns.map((c) => {return {id:c.id,fileName:c.image.fileUrl}}))
        );
        columnBlobImagesSaved.forEach((value, key) => {
            if (data.columns) {
                const columnIndex = data.columns.findIndex(c => c.id && c.id === key);
                const id = data.columns[columnIndex].image.id
                const title = `Título de columna ${columnIndex + 1} - Noticia ${data.headline}`;
                const description = `Descripción de columna ${columnIndex + 1} - Noticia ${data.headline}`;
                const image: FormTMediaFile | undefined = data.columns[columnIndex].image &&
                    {
                        ...data.columns[columnIndex].image,
                        id: id ? Number(id) : 0,
                        fileUrl: value.payload.fileUrl,
                        description,
                        title,
                        fileFormat: value.payload.fileFormat,
                        fileSize: value.payload.fileSize
                    } as unknown as FormTMediaFile
                data.columns[columnIndex].image = image as FormTMediaFile;
            }
        })

        if (images && images.length > 0) {
            let filteredImages = images;
            if (mode === 'update') {
                filteredImages = filteredImages.filter(i => !i.src.includes("/uploads/images/"))
                await removeImagesGaleryFromStorage();
            }
            const uploadedImagesResponse = await saveGaleryImages(filteredImages);
            const uploadedGaleryImages: FormTMediaFile[] = [];
            for (const response of uploadedImagesResponse) {
                // if (isErrorResponse(response)) {
                //     setSnackbarMessage(UPLOAD_MEDIA_FILES_PROBLEM)
                //     break;
                // }
                uploadedGaleryImages.push(initMediaFile(0,
                    response.payload.fileUrl,
                    response.payload.fileName,
                    `${initialData.headline} descripcion - imagen galeria`,
                    response.payload.fileFormat,
                    response.payload.fileSize))
            }
            data.images = data.images && data.images.length > 0 ? [...data.images, ...uploadedGaleryImages] : uploadedGaleryImages;
            data.images = data.images.filter((i) => !galeryImagesToDelete.has(i.id ?? 0));
        }

        try {
            const response = mode === 'create' ? await newsService.create<TNewsForm, TNews>(data) : await newsService.update<TNewsForm, TNews>(data, data.id?.toString() ?? '');
                if (mode === 'update' && setUpdatedNews) setUpdatedNews(response.payload)
                else addNews(response.payload);
                setCreatedNewsId(response.payload.id);
                setSuccess(true);
                reset();
            // } else {
            //     imagesUploadRollback(data);
            //     setSnackbarMessage(resolveErrorMessage(response.message))
            // }
        } catch (error) {
            imagesUploadRollback(data);

            setSnackbarMessage(resolveErrorMessage(""))
        } finally {
            setLoading(false);
        }


    };

    useEffect(() => { setChangesMade(isDirty) }, [isDirty])

    const { field: headlineField } = useController({
        control,
        name: 'headline',
        rules: { maxLength: 80 },
    });


    const { field: activeField } = useController({
        control,
        name: 'published',
    });

    const { field: leadField, fieldState: leadState } = useController({
        control,
        name: 'lead',
    });

    const { field: bodyField, fieldState: bodyState } = useController({
        control,
        name: 'body',
    });

    const { field: closureField, fieldState: closureState } = useController({
        control,
        name: 'closure',
    });
    useEffect(() => {
        if (initialData && mode === 'update') {
            const formData: TNewsForm = {
                ...initialData,
                mainImage: {
                    ...initialData.mainImage,
                    isExisting: true,
                    preview: initialData.mainImage.fileUrl
                },
                columns: initialData.columns.map((column) => ({
                    ...column,
                    image: {
                        ...column.image,
                        isExisting: true,
                        preview: column.image.fileUrl,
                    },
                })),
                images: initialData.images.map((image) => ({
                    ...image,
                    isExisting: true,
                    preview: image.fileUrl
                })),
            };
            reset(formData);
        }
    }, [initialData, mode, reset]);
    return (
        <section className='news-form crm-form'>
            {!success ? <form onSubmit={handleSubmit(onSubmit)}>
                <HorizontalStepper finishButtonLabel={mode === 'create' ? 'Crear noticia' : 'Actualizar noticia'} steps={
                    [{
                        label: 'Información principal',
                        step: <Stack direction={"column"} width={"100%"} className='main-info'>
                            <Stack minWidth={"300px"}>
                                {
                                    <Card sx={{ mb: 4, padding: "10px 0" }}  >
                                        <CardContent >
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12 }}>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={activeField.value}
                                                                onChange={(e) => activeField.onChange(e.target.checked)}
                                                            />
                                                        }
                                                        label="Publicar"
                                                    />

                                                </Grid>
                                                <Grid size={{ xs: 12, md: 12 }} >
                                                    <TextField
                                                        {...headlineField}
                                                        label="Título (*)"
                                                        type="text"
                                                        fullWidth
                                                        margin="normal"
                                                        error={!!errors.headline}
                                                        helperText={errors.headline?.message}
                                                    />
                                                </Grid>


                                                <Grid size={{ xs: 12, md: 12 }} >
                                                    <Typography variant='h6'>Encabezado <small style={{ color: "red" }}>(*)</small></Typography>
                                                    <RichtextEditorV2
                                                        field={leadField}
                                                        error={leadState.error}
                                                        clearErrors={clearErrors}
                                                        setError={setError}
                                                        fieldName={leadField.name}
                                                        maxLength={500}
                                                        placeholder={"Ingrese el encabezado de la nota"}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 12 }} >
                                                    <Typography variant='h6'>Cuerpo <small style={{ color: "red" }}>(*)</small></Typography>
                                                    <RichtextEditorV2
                                                        field={bodyField}
                                                        error={bodyState.error}
                                                        clearErrors={clearErrors}
                                                        setError={setError}
                                                        fieldName={bodyField.name}
                                                        maxLength={800}
                                                        placeholder={"Ingrese el cuerpo de la nota"}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 12 }} >
                                                    <Typography variant='h6'>Cierre </Typography>
                                                    <RichtextEditorV2
                                                        field={closureField}
                                                        error={closureState.error}
                                                        clearErrors={clearErrors}
                                                        setError={setError}
                                                        fieldName={closureField.name}
                                                        maxLength={600}
                                                        placeholder={"Ingrese el cierre de la nota"}
                                                    />
                                                </Grid>

                                            </Grid>
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <Typography variant="subtitle1" color='info'>Imagen principal</Typography>
                                                <UploadFileBox
                                                    croppedImage={croppedMainImage ?? ''}
                                                    handleFileChange={handleMainFileChange}
                                                    open={mainImageDialogOpen}
                                                    close={() => setMainImageDialogOpen(false)}
                                                    onCropComplete={handleMainImageCropComplete}
                                                    imageSrc={mainImageSrc}
                                                    cropType="square"
                                                />
                                            </Grid>
                                        </CardContent>

                                    </Card>
                                }
                            </Stack>

                        </Stack>
                    },
                    {
                        label: 'Columnas',
                        step:
                            <ColumnsNestedFormNews clearErrors={clearErrors} setError={setError} control={control} columnsImageBlobMap={columnsImages} setColumnsImageBlobMap={setColumnsImages} columnsCroppedImages={croppedColumnImages} setColumnsCroppedImages={setCroppedColumnImages} watch={watch} />
                    }, {
                        label: 'Galeria',
                        step: <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            <Typography variant="h4" color='info'>Sube las imágenes</Typography>
                            <MultiImageUploadInput
                                images={images}
                                handleMultiImageChange={handleMultiImageChange}
                                removeImage={removeImage}
                            />
                        </Box>
                    },
                    {
                        label: 'Etiquetas',
                        step: <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            <Typography variant="h4" color='info'>Añade etiquetas para relacionar la noticia con las demás</Typography>
                            <Box>
                                <TagsNestedForm getValues={getValues} setValue={setValue} />
                            </Box>

                        </Box>
                    }
                    ]
                } />

            </form> :
                <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    {mode === 'create' ? <SuccessBox goTo={`/crm/${hash}/dashboard/news/${createdNewsId}`} gotoLabel='Ver noticia' successLabel='Noticia creada correctamente' /> : <SuccessBox successLabel='Noticia editada correctamente' />}
                </div>
            }

        </section>
    );

}

export default NewsForm;