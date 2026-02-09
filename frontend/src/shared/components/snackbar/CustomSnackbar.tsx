import styled from '@emotion/styled';
import { Alert, AlertTitle } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { FC, useEffect, useState } from 'react';
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
import TSnackbarMessage from 'src/models/TSnackbarMessage';


export type TCustomSnackbarProps = TSnackbarMessage;
const CustomSnackbar: FC<any> = () => {
    const { snackbarMessage, setSnackbarMessage } = useCRMCommon();
    const [open, setOpen] = useState<boolean>();

    useEffect(() => {
        setOpen(snackbarMessage.show);
    }, [snackbarMessage]);

    const handleClose = () => {
        setSnackbarMessage({
            ...snackbarMessage,
            message: '',
            title: '',
            show: false,
            severity: "success",
        });
    };
    const CustomAlert = styled(Alert)(() => ({
        color: 'black',
        backgroundColor: 'white',
        border: '0.2px solid black',
        boxShadow: '2px black'
    }));

    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                onClose={handleClose}
                open={open}
                autoHideDuration={snackbarMessage.duration}
                sx={{ boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)' }}
            >
                <CustomAlert severity={snackbarMessage.severity} sx={{ minWidth: '400px' }}>
                    <AlertTitle sx={{ fontWeight: 'bold' }}>
                        {snackbarMessage.title}
                    </AlertTitle>
                    {snackbarMessage.message}
                </CustomAlert>
            </Snackbar>
        </div>
    );
};

export default CustomSnackbar;