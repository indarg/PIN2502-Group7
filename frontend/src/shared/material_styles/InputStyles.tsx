// inputStyles.ts
import { styled, SxProps } from '@mui/material';

// eslint-disable-next-line react-refresh/only-export-components
export const filledGreyInputSx: SxProps = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#EAEAEA', // Color del borde normal
    },
    '&:hover fieldset': {
      borderColor: '#EAEAEA', // Color del borde al pasar el ratón
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--m-c)', // Color del outline (borde enfocado)
    },
    backgroundColor: '#EAEAEA', // Color de fondo
  },
  '& .MuiInputLabel-root': { // Estilos para el label normal
    color: 'grey',
  },
  '& .MuiInputLabel-root.Mui-focused': { // Estilos para el label enfocado
    color: 'black', // Puedes mantener el color del outline o cambiarlo
  },
};


export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
