import { Box, FormControlLabel, Skeleton, Stack, Switch, TextField, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import "react-quill/dist/quill.snow.css";
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
import { useCRMYouTubeVideo } from 'src/context/CRMYoutubeVideoContext/useCRMYouTubeVideo';
import { TYoutubeVideoForm } from 'src/forms/TYoutubeVideoForm';
import { TFormFieldConfig } from 'src/models/TFormFieldConfig';
import { resolveErrorMessage, resolveSuccessMessage } from 'src/models/TSnackbarMessage';
import { TYoutubeVideo } from 'src/models/TYoutubeVideo';
import CRMYouTubeVideoService from 'src/services/CRMYouTubeVideoService';
import { filledGreyInputSx } from 'src/shared/material_styles/InputStyles';
import HorizontalStepper from '../horizontal-stepper/HorizontalStepper';
import LazyYouTubeEmbed from '../lazy_youtube_embed/LazyYouTubeEmbed';
import SuccessBox from '../success_box/SuccessBox';
import './YoutubeVideoForm.css';
type TProps = {
    ytVideo?: TYoutubeVideo,
    createOrUpdate: 'create' | 'update'
}

const YT_VIDEO_TEMPLATE: TYoutubeVideoForm = {
    id: '',
    title: '',
    order: -1,
    active: false
}

const YoutubeVideoForm: FC<TProps> = ({ createOrUpdate, ytVideo = Object.assign(YT_VIDEO_TEMPLATE, {}) }) => {
    const [loading, setLoadingYoutubeVideoForm] = useState<boolean>(true);
    const [ytVideosFields, setFields] = useState<TFormFieldConfig<TYoutubeVideoForm>[]>([]);
    const { addYouTubeVideo } = useCRMYouTubeVideo();
    const { setSnackbarMessage, hash, setLoading, isLoading } = useCRMCommon();
    const [sucess, setSuccess] = useState<boolean>(false);
    const [createdYoutubeVideoId, setCreatedYoutubeVideoId] = useState<string>('');

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors }
    } = useForm<TYoutubeVideoForm>({ defaultValues: ytVideo });

    const videoIdentifier = watch('id');
    const title = watch('title');


    const onSubmit: SubmitHandler<TYoutubeVideoForm> = async (data) => {
        const tagService = new CRMYouTubeVideoService();
        setLoading(true);
        try {
            const response = createOrUpdate === 'create' ? await tagService.create<TYoutubeVideoForm, TYoutubeVideo>(data) : await tagService.update<TYoutubeVideoForm, TYoutubeVideo>(data, data.id?.toString() ?? '');
                addYouTubeVideo(response.payload);
                setCreatedYoutubeVideoId(response.payload.id);
                setSnackbarMessage(resolveSuccessMessage(response.message))
                setSuccess(true);
                reset();
                return;
        } catch (error) {
            setSnackbarMessage(resolveErrorMessage())
        } finally {
            setLoading(false);
        }

    };

    const init = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        setFields([
            {
                name: "active",
                label: "Activo",
                type: "toggle",
                placeholder: "",
                required: true,
                sxProps: filledGreyInputSx
            },
            {
                name: "id",
                label: "Identificador de video",
                placeholder: "Ingrese identificador de youtube",
                type: "text",
                required: true,
                sxProps: filledGreyInputSx
            },
            {
                name: "title",
                label: "Tìtulo/Descripción",
                type: "text",
                placeholder: "Ingrese un título o pequeña descripción",
                required: true,
                sxProps: filledGreyInputSx
            },

        ]);

    }

    useEffect(() => {
        init()
        setTimeout(() => {
            setLoadingYoutubeVideoForm(false);
        }, 500)
    }, [])

    useEffect(() => { }, [videoIdentifier,title])

    return (
        <section className='tag-form crm-form'>

            {!sucess ? <form onSubmit={handleSubmit(onSubmit)}>
                <HorizontalStepper finishButtonLabel={createOrUpdate === 'create' ? 'Crear video youtube' : 'Actualizar video youtube'} steps={
                    [{
                        label: 'Complete la información',
                        step:
                            <section className='main-info'>
                                <Stack direction="column" spacing={2}>
                                    {loading ?
                                        <>
                                            <Skeleton variant="rounded" width={"20%"} style={{ minWidth: 100 }} height={30} />
                                            <Skeleton variant="rounded" width={"100%"} style={{ minWidth: 330 }} height={60} />
                                            <Skeleton variant="rounded" width={"100%"} style={{ minWidth: 330 }} height={60} />
                                            <Skeleton variant="rounded" width={"100%"} style={{ minWidth: 330 }} height={60} />
                                            <Skeleton variant="rounded" width={"100%"} style={{ minWidth: 330 }} height={90} />
                                        </>
                                        :
                                        ytVideosFields.map((fieldForm, index: number) => (
                                            <>
                                                {fieldForm.type === 'toggle' &&
                                                    <Box sx={{ display: "flex", gap: 5 }} key={index}>
                                                        <Typography variant="subtitle1" color='info'>Publicar</Typography>
                                                        <FormControlLabel
                                                            control={
                                                                <Controller
                                                                    name={fieldForm.name}
                                                                    control={control}
                                                                    defaultValue={false}
                                                                    render={({ field }) => (
                                                                        <Switch
                                                                            {...field}
                                                                            checked={field.value as boolean}
                                                                            onChange={(e) => field.onChange(e.target.checked)}
                                                                        />
                                                                    )}
                                                                />
                                                            }
                                                            label={fieldForm.label}
                                                        />
                                                    </Box>
                                                }
                                                {fieldForm.type === 'text' &&
                                                    <TextField
                                                        disabled={createOrUpdate === 'update' && fieldForm.name === 'id'}
                                                        key={index}
                                                        variant="outlined"
                                                        className=''
                                                        sx={fieldForm.sxProps}
                                                        {...register(fieldForm.name, { required: fieldForm.required })}
                                                        label={fieldForm.label}
                                                        type={fieldForm.type}
                                                        placeholder={fieldForm.placeholder}
                                                        fullWidth
                                                        slotProps={{
                                                            input: fieldForm.icon,
                                                        }}
                                                        error={!!errors[fieldForm.name]}
                                                        helperText={errors[fieldForm.name] && "Campo requerido"}
                                                    />}
                                            </>
                                        ))}
                                </Stack>
                                <Typography variant='h6' color='info'>Previsualizacion</Typography>

                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <Box sx={{
                                        width: "60%",
                                        minWidth:"500px"
                                    }}>
                                        {videoIdentifier && <LazyYouTubeEmbed color='info' title={title ?? ''} videoId={videoIdentifier} />}
                                    </Box>
                                </Box>
                            </section>
                    }

                    ]
                } />

                <div>
                    {loading ?
                        <>
                            <Skeleton variant="rounded" width={330} style={{ minWidth: 330 }} height={30} />
                            <Skeleton variant="rounded" width={330} style={{ minWidth: 330 }} height={30} />
                        </>
                        :
                        <>
                            {/* <Button variant="outlined">Cancelar</Button> */}
                            {/* <Button variant="contained" type="submit">Guardar como borrador</Button> */}
                        </>
                    }

                </div>
            </form> :
                <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    {createOrUpdate === 'create' ? <SuccessBox goTo={`/crm/${hash}/dashboard/yt-videos/${createdYoutubeVideoId}`} gotoLabel='Ver video'
                        successLabel='Video creado correctamente' /> : <SuccessBox successLabel='Video editado correctamente' />}
                </div>
            }

        </section>
    );

}

export default YoutubeVideoForm;