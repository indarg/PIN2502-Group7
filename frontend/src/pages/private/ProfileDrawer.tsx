import { Avatar, Box, Button, Drawer, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from 'src/context/AuthContext/useAuth';
import { useCRMUsers } from 'src/context/CRMUsersContext/useCRMUsers';
import UtilService from 'src/services/UtilService';
import ProfileForm from 'src/shared/components/profile_form/ProfileForm';

type Props = {

    close: () => void,
    open: boolean,

}

export default function ProfileDrawer({ close, open }: Props) {
    const {authenticatedUser} = useAuth();
    const [editForm, setEditForm] = useState<boolean>(false);
    useEffect(() => {}, [authenticatedUser]);
    return (
        <Drawer
            anchor={'right'}
            open={open}
            onClose={() => {
                setEditForm(false);
                close()
            }}
            sx={{
                '& .MuiDrawer-paper': {
                    width: 350,
                    boxSizing: 'border-box',
                    padding: "10px 5px",
                    overflow:"hidden scroll"
                }
            }}
        >
            {!editForm ? <>
                <Box
                    sx={{
                        margin: 0,
                        boxSizing: 'border-box',
                        padding: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    role="presentation"

                >
                    {/* informacion del usuario */}
                    <Avatar
                        alt={authenticatedUser?.firstName}
                        title={`${authenticatedUser?.firstName} ${authenticatedUser?.lastName}`}
                        src={authenticatedUser ? UtilService.resolveFile(authenticatedUser?.profileImage?.fileUrl) : ''}
                        sx={{ width: 100, height: 100, mb: 2 }}
                    />
                    <Typography variant="h5">Perfil</Typography>
                    <Box sx={{ maxWidth: 400, width: "100%", mt: 4 }}>
                        {/* botones */}
                        <Stack direction="column" spacing={2} mb={3}>
                            {/* <Button variant="outlined" onClick={() => console.log('Cambiar contraseña')}>
                                Cambiar contraseña
                            </Button> */}
                            <Button  variant="contained" onClick={() => setEditForm(true)}>
                                Editar perfil
                            </Button>
                        </Stack>

                        {/* Datos del usuario */}
                        <Stack spacing={2}>
                            <div>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Nombre:
                                </Typography>
                                <Typography variant="body2">
                                    {authenticatedUser?.firstName || '—'}
                                </Typography>
                            </div>

                            <div>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Apellido:
                                </Typography>
                                <Typography variant="body2">
                                    {authenticatedUser?.lastName || '—'}
                                </Typography>
                            </div>

                            <div>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Email:
                                </Typography>
                                <Typography variant="body2">
                                    {authenticatedUser?.email || '—'}
                                </Typography>
                            </div>
                        </Stack>
                    </Box>
                </Box>
                <Box sx={{ pt: 4, textAlign: 'right', mt: "auto", padding: 3 }}>
                    <Button variant="outlined" color="primary" onClick={close} sx={{ width: 150 }}>
                        Cerrar
                    </Button>
                </Box>
            </> : <ProfileForm  close={() => setEditForm(false)} />}
        </Drawer>
    )
}