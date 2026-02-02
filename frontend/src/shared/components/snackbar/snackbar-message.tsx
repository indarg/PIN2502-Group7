import styled from '@emotion/styled';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import TSnackbarMessage from 'src/models/TSnackbarMessage';

export type TSnackbarComponentProps = TSnackbarMessage & {
  onClose: () => void;
};

const SnackbarComponent: FC<TSnackbarComponentProps> = ({
  show,
  title,
  message,
  severity = 'info',
  duration = 3000,
  onClose,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setOpen(Boolean(show));
  }, [show]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const CustomAlert = styled(Alert)(() => ({
    color: 'black',
    backgroundColor: 'white',
    border: '0.2px solid black',
    boxShadow: '2px black',
  }));

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      sx={{ boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)' }}
    >
      <CustomAlert severity={severity} sx={{ minWidth: '400px' }}>
        <AlertTitle sx={{ fontWeight: 'bold' }}>
          {title}
        </AlertTitle>
        {message}
      </CustomAlert>
    </Snackbar>
  );
};

export default SnackbarComponent;
