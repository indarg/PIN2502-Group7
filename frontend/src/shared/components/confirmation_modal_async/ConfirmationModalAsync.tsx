import { Box, Button, Modal, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorResponse } from 'src/models/response/TResponses';
import TConfirmationModalAsync from 'src/models/TConfirmationModalAsync';
import TSnackbarMessage from 'src/models/TSnackbarMessage';

type TProps = {
    confirmationModal: TConfirmationModalAsync,
    setNotification: (snackbarMessage: TSnackbarMessage) => void,
    reset: () => void
}
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 200,
    display: "flex",
    flexDirection: "column",
    gap: 7,
    alignItems: "center",
    justifyContent: "center",
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 1,
    p: 4,
};

const ConfirmationModalAsync: FC<TProps> = ({ confirmationModal, setNotification, reset }) => {
    const [open, setOpen] = useState(confirmationModal.show);
    const handleClose = () => {
        setOpen(false)
        reset()
    };
    const nav = useNavigate();
    const confirm = async () => {
        try {
            const response = await confirmationModal.action();
            setNotification({
                title: "Todo a salido perfecto",
                message: response.message,
                duration: 3000,
                show: true,
                severity: 'success'
            })

        } catch (error) {
            if (error instanceof ErrorResponse) {
                setNotification({
                    title: "Ha ocurrido un problema",
                    message: error.message,
                    duration: 3000,
                    show: true,
                    severity: 'error'
                })
            } else
                setNotification({
                    title: "Ha ocurrido un problema",
                    message: "Vuelva a intentarlo. Si el problema vuelve ha ocurrir, contácte a soporte",
                    duration: 3000,
                    show: true,
                    severity: 'error'
                })
        } finally {
            handleClose();
        }
        if (confirmationModal.redirectTo)
            nav(confirmationModal.redirectTo)


    }
    useEffect(() => { }, [confirmationModal])
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" color='info'>
                    {confirmationModal.message ?? '¿Está seguro de realizar esta acción?'}
                </Typography>
                <Box sx={{ display: "flex", gap: 5 }}>
                    <Button onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant='contained' color='error' onClick={confirm}>
                        Confirmar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ConfirmationModalAsync;
