import { Box, Button, Skeleton, Stack, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import "react-quill/dist/quill.snow.css";
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
import { useCRMTag } from 'src/context/CRMTagContext/useCRMTag';
import { TTagForm } from 'src/forms/TTagForm';
import { TFormFieldConfig } from 'src/models/TFormFieldConfig';
import { TTag } from 'src/models/TTag';
import { filledGreyInputSx } from 'src/shared/material_styles/InputStyles';
import HorizontalStepper from '../horizontal-stepper/HorizontalStepper';
import SuccessBox from '../success_box/SuccessBox';
import './TagForm.css';
import CRMTagService from 'src/services/CRMTagsService';
type TProps = {
    tag?: TTag,
    createOrUpdate: 'create' | 'update'
}

const TAG_TEMPLATE: TTagForm = {
    code: '',
    id: 0,
    name: ''
}

const TagForm: FC<TProps> = ({ createOrUpdate, tag = Object.assign(TAG_TEMPLATE, {}) }) => {
    const [loading, setLoadingTagForm] = useState<boolean>(true);
    const [tagFields, setFields] = useState<TFormFieldConfig<TTagForm>[]>([]);
    const { addTag } = useCRMTag();
    const { setSnackbarMessage, hash, setLoading, isLoading } = useCRMCommon();
    const [sucess, setSuccess] = useState<boolean>(false);
    const [createdTagId, setCreatedTagId] = useState<number>(-1);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        setValue,
        formState: { errors }
    } = useForm<TTagForm>({ defaultValues: tag });
    const nameValue = watch('name');



    const onSubmit: SubmitHandler<TTagForm> = async (data) => {
        const tagService = new CRMTagService();
        setLoading(true);
        try {
            const response = createOrUpdate === 'create' ? await tagService.create<TTagForm, TTag>(data) : await tagService.update<TTagForm, TTag>(data, data.id?.toString() ?? '');
                addTag(response.payload);
                setCreatedTagId(response.payload.id);
                setSuccess(true);
                reset();

        } catch (error) {
            setSnackbarMessage({
                title: 'Ha ocurrido un problema',
                message: 'Por favor inténtelo nuevamente o contacte a soporte.',
                duration: 4000,
                severity: 'error',
                show: true
            })
        } finally {
            setLoading(false);
        }


    };



    const init = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        setFields([
            {
                name: "name",
                label: "Nombre",
                placeholder: "Ingrese el nombre de la etiqueta",
                type: "text",
                required: true,
                sxProps: filledGreyInputSx
            },
            {
                name: "code",
                label: "",
                type: "text",
                placeholder: "Ingrese un codigo",
                required: true,
                sxProps: filledGreyInputSx
            },
        ]);

    }


    useEffect(() => {
        init()
        setTimeout(() => {
            setLoadingTagForm(false);
        }, 500)
    }, [])
    useEffect(() => {
        if (nameValue) {
            const generatedCode = nameValue.toUpperCase().replace(/\s+/g, '_');
            setValue('code', generatedCode, { shouldValidate: true }); // Actualiza 'code' y valida
        } else {
            setValue('code', '', { shouldValidate: true });
        }
    }, [nameValue, setValue]);
    return (
        <section className='tag-form crm-form'>

            {!sucess ? <form onSubmit={handleSubmit(onSubmit)}>
                <HorizontalStepper finishButtonLabel={createOrUpdate === 'create' ? 'Crear etiqueta' : 'Actualizar etiqueta'} steps={
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
                                        tagFields.map((field, index: number) => (
                                            <>
                                                {field.type === 'text' &&
                                                    <TextField
                                                        key={index}
                                                        variant="outlined"
                                                        className=''
                                                        sx={field.sxProps}
                                                        {...register(field.name, { required: field.required })}
                                                        label={field.label}
                                                        type={field.type}
                                                        placeholder={field.placeholder}
                                                        fullWidth
                                                        disabled={field.name === 'code'}
                                                        slotProps={{
                                                            input: field.icon,
                                                        }}
                                                        error={!!errors[field.name]}
                                                        helperText={errors[field.name] && "Campo requerido"}
                                                    />}
                                            </>
                                        ))}
                                </Stack>

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
                    {createOrUpdate === 'create' ? <SuccessBox goTo={`/crm/${hash}/dashboard/tags/${createdTagId}`} gotoLabel='Ver etiqueta'
                        successLabel='Etiqueta creada correctamente' /> : <SuccessBox successLabel='Etiqueta editada correctamente' />}
                </div>
            }

        </section>
    );

}

export default TagForm;