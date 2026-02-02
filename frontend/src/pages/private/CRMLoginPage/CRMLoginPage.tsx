import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button, IconButton, Skeleton, TextField } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
import { TSignInCredentials } from "src/models/states/TSignInCredentials";
import { TFormFieldConfig } from "src/models/TFormFieldConfig";
import { resolveErrorMessage, resolveSuccessMessage } from 'src/models/TSnackbarMessage';
import TUserSession from 'src/models/TUserSession';
import UserService from 'src/services/UserService';
import Logo from "src/shared/components/Logo";
import CustomSnackbar from "src/shared/components/snackbar/CustomSnackbar";
import { filledGreyInputSx } from "src/shared/material_styles/InputStyles";
import './CRMLoginPage.css';
import TokenInputUI from './TokenInputUI';
import { environment } from 'src/environments/environment';
import { useAuth } from 'src/context/AuthContext/useAuth';

const CRMLoginPage: FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [tokenInsertion, setTokenInsertion] = useState(false);
    const [signInResponse, setSignInResponse] = useState<TUserSession | null>(null);
    const userService = new UserService();
    const navigate = useNavigate();
    const { setAuthenticatedUser, signOut } = useAuth();
    const { hash, setSnackbarMessage, isLoading, setLoading } = useCRMCommon();
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 300)
    }, [])
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TSignInCredentials>();


    const signIn = async (hash: string, credentials: TSignInCredentials): Promise<boolean> => {
        try {
            const response = await userService.signInCRM(hash, credentials);
                const { payload: { user, accessToken, refreshToken } } = response;
                setSignInResponse({ user, accessToken, refreshToken })
                if (environment.ENV === 'development') {
                    setAuthenticatedUser({ user, accessToken, refreshToken });
                    setSnackbarMessage(resolveSuccessMessage("Usuario autenticado exitosamente"));
                    navigate(`/crm/${hash}/dashboard/home`);
                }
        } catch (e) {
            setSnackbarMessage(resolveErrorMessage("Ha ocurrido un problema, por favor inténtelo en otro momento o contacte a soporte."));
            signOut();
            return false;
        }
        return true;
    };

    const onSubmit: SubmitHandler<TSignInCredentials> = async (data) => {
        setLoading(true);
        if (!hash) return;
        const success = await signIn(hash, data);
        reset();
        if (success)
            setTokenInsertion(true);
        setLoading(false);
    };

    const validateToken = async (token: string) => {

        try {
            setLoading(true);
            const tokenResponse = await userService.verifyToken(hash, token, signInResponse?.user.id ?? 0);
                signInResponse && setAuthenticatedUser(signInResponse);
                setSnackbarMessage(resolveSuccessMessage("Usuario autenticado exitosamente"));
                navigate(`/crm/${hash}/dashboard/home`);
      
        } catch (error) {
            signOut();
            setSnackbarMessage(resolveErrorMessage("Algo a salido mal, por favor contacte a soporte"))
            setTokenInsertion(false);
        } finally {
            setLoading(false);
        }
    }

    const fields: TFormFieldConfig<TSignInCredentials>[] = [
        {
            name: "email",
            label: "Correo",
            type: "email",
            placeholder: "Ingrese su correo",
            required: true,
            icon: { endAdornment: <EmailIcon sx={{ width: 20, opacity: 0.5 }} /> },
            sxProps: filledGreyInputSx
        },
        {
            name: "password",
            label: "Contraseña",
            type: showPassword ? "text" : "password",
            placeholder: "Ingrese su contraseña",
            sxProps: filledGreyInputSx,
            required: true,
            icon: {
                endAdornment: (
                    <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                    >
                        {showPassword ? (
                            <VisibilityOffIcon sx={{ width: 20, opacity: 0.5 }} />
                        ) : (
                            <VisibilityIcon sx={{ width: 20, opacity: 0.5 }} />
                        )}
                    </IconButton>
                )
            },
        },
    ];

    return (
        <main className="page crm-login-page">
            <section >
                <img src="/240dd86a07da4db743aeb4e0004d5270.jpg" alt='login image' />
                <Logo logo={false} />
            </section>
            <section>
                <div>
                    {isLoading ? <Skeleton variant="circular" width={40} height={40} /> :
                        <span>
                            <img src="/user-icon.svg" alt='user icon' />
                        </span>
                    }
                </div>
                {!tokenInsertion ? <form onSubmit={handleSubmit(onSubmit)}>
                    {isLoading ?
                        <>
                            <Skeleton variant="rounded" width={"100%"} style={{ minWidth: 330 }} height={30} />
                            <Skeleton variant="rounded" width={"100%"} style={{ minWidth: 330 }} height={30} />
                        </>
                        :
                        fields.map((field, index: number) => (
                            <TextField
                                key={index}
                                variant="outlined"
                                className='sign-in-inputs'
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
                        ))}
                    <div>
                        {isLoading ?
                            <>
                                <Skeleton variant="rounded" width={330} style={{ minWidth: 330 }} height={30} />
                                <Skeleton variant="rounded" width={330} style={{ minWidth: 330 }} height={30} />
                            </>
                            :
                            <>
                                {/* <Button variant="outlined">Crear usuario</Button> */}
                                <Button variant="contained" type="submit">Ingresar</Button>
                            </>
                        }

                    </div>
                </form> :
                    <TokenInputUI isLoading={isLoading} onVerify={(token: string) => validateToken(token)} />
                }
            </section>
            <CustomSnackbar />
        </main >
    )
}

export default CRMLoginPage