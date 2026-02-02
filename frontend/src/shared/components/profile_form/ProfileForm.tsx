import { Box, Button, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import "react-quill/dist/quill.snow.css";
import { useAuth } from 'src/context/AuthContext/useAuth';
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
import { TFormFieldConfig } from 'src/models/TFormFieldConfig';
import { initMediaFile, TMediaFile, UPLOAD_MAIN_IMAGE_PROBLEM } from 'src/models/TMediaFile';
import { TUser } from 'src/models/TUser';
import UserService from 'src/services/UserService';
import UtilService from 'src/services/UtilService';
import useFileUpload from 'src/shared/hooks/useFileUpload';
import { filledGreyInputSx } from 'src/shared/material_styles/InputStyles';
import UploadFileBox from '../upload_file_box/UploadFileBox';
import './ProfileForm.css';
type TProps = {

    close: () => void
}


const ProfileForm: FC<TProps> = ({ close }) => {
    const { authenticatedUser, updateUserProfile } = useAuth();
    const [loading, setLoadingProfileForm] = useState<boolean>(true);
    const [userFields, setFields] = useState<TFormFieldConfig<TUser>[]>([]);
    const { setSnackbarMessage, hash, setLoading, isLoading } = useCRMCommon();
    const [sucess, setSuccess] = useState<boolean>(false);
    const [createdNewsId, setCreatedNewsId] = useState<number>(-1);
    const [profileImageSrc, setProfileimageSrc, croppedProfileimage, setMainCroppedImage, profileImageDialogOpen, setProfileimageDialogOpen, handleMainFileChange, handleProfileimageCropComplete, saveProfileimage, profileImageBlob] = useFileUpload(UtilService.resolveFile(authenticatedUser?.profileImage?.fileUrl) ?? null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
        setValue,
        getValues
    } = useForm<TUser>({ defaultValues: authenticatedUser });


    const onSubmit: SubmitHandler<TUser> = async (data) => {
        const userService = new UserService();
        setLoading(true);
        if (profileImageBlob) {
            const isProfileimageSaved = await saveProfileimage(authenticatedUser?.profileImage?.fileUrl.replace('/media/', ''));
            if (isProfileimageSaved) {
                data.profileImage = initMediaFile(data.profileImage?.id ?? 0,
                    isProfileimageSaved.fileUrl,
                    `profile-image-${data.lastName}-${data.firstName}`,
                    `Imagen de perfil`,
                    isProfileimageSaved.fileFormat,
                    isProfileimageSaved.fileSize) as TMediaFile

            } else {
                setSnackbarMessage(UPLOAD_MAIN_IMAGE_PROBLEM)
                setLoading(false);
                return;
            }
        }
        const response = await userService.updateProfile(data, hash);
        try {
            updateUserProfile(data);
            setSnackbarMessage({
                message: "Perfil actualizado correctamente",
                severity: "success",
                show: true, duration: 3000,
                title: ''
            });
            reset();
            close();
        }
        catch (error) {
            setSnackbarMessage({
                message: response.message,
                severity: "error",
                show: true, duration: 3000,
                title: ''
            });
        }
        setLoading(false);
    };

    const init = () => {

        setFields([
            {
                name: "firstName",
                label: "Nombre",
                type: "text",
                placeholder: "Ingrese un nombre",
                required: true,
                sxProps: filledGreyInputSx
            },
            {
                name: "lastName",
                label: "Apellido",
                type: "text",
                placeholder: "Ingrese un apellido",
                required: true,
                sxProps: filledGreyInputSx
            },
        ]);
    }


    useEffect(() => {
        if (!authenticatedUser) return;
        init();
        setTimeout(() => {
            setLoadingProfileForm(false);
        }, 500)
    }, [])


    if (!authenticatedUser) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h6" color="error">
                    No se pudo cargar el perfil del usuario.
                </Typography>
            </Box>
        );
    }

    return (
        <section className='profile-form'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2} flexDirection={"column"}>
                    <Stack spacing={2} flexDirection={"column"}>
                        {loading ?
                            <>
                                <Skeleton variant="rounded" width={"20%"} style={{ minWidth: 100 }} height={30} />
                                <Skeleton variant="rounded" width={"100%"} style={{ minWidth: 330 }} height={60} />
                                <Skeleton variant="rounded" width={"100%"} style={{ minWidth: 330 }} height={60} />
                                <Skeleton variant="rounded" width={"100%"} style={{ minWidth: 330 }} height={60} />
                                <Skeleton variant="rounded" width={"100%"} style={{ minWidth: 330 }} height={90} />
                            </>
                            :
                            userFields.map((field, index: number) => (
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
                                            slotProps={{
                                                input: field.icon,
                                            }}
                                            error={!!errors[field.name]}
                                            helperText={errors[field.name] && "Campo requerido"}
                                        />
                                    }


                                </>
                            ))}
                    </Stack >
                    <Box >
                        <Typography variant="subtitle1" color='info'>Imagen principal</Typography>
                        <UploadFileBox cropType='circle' close={() =>
                            setProfileimageDialogOpen(false)}
                            croppedImage={croppedProfileimage ?? ''}
                            handleFileChange={handleMainFileChange}
                            imageSrc={profileImageSrc}
                            onCropComplete={handleProfileimageCropComplete}
                            open={profileImageDialogOpen} />
                    </Box>
                </Stack>

                <Stack direction={"row"} spacing={2} marginTop={7}>
                    {loading ?
                        <>
                            <Skeleton variant="rounded" width={330} style={{ minWidth: 330 }} height={30} />
                            <Skeleton variant="rounded" width={330} style={{ minWidth: 330 }} height={30} />
                        </>
                        :
                        <>
                            <Button variant="outlined" onClick={close}>Cancelar</Button>
                            <Button variant="contained" disabled={isSubmitting} type='submit' >Actualizar</Button>
                        </>
                    }

                </Stack>
            </form>

        </section>
    );

}

export default ProfileForm;