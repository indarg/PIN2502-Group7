// inputStyles.ts
import { SxProps } from '@mui/material';

const toggleButtonStyles: SxProps = {
  px: 2,                //  padding horizontal reducido
  py: 0.5,              // padding vertical reducido
  fontSize: '0.75rem',  // texto más pequeño
  minHeight: '32px',    // altura mínima
  textTransform: 'none',
  fontWeight: 500,
  // estado seleccionado
  '&.Mui-selected': {
    backgroundColor: 'var(--m-c3)',
    color: '#fff',
    '&:hover': {
      backgroundColor: 'var(--m-c3)',
    },
  },
  
  '&.type-2.Mui-selected': {
    backgroundColor: 'var(--m-c3)',
    color: '#fff',
    '&:hover': {
      backgroundColor: 'var(--m-c3)',
    },
  },
  // estado hover (no seleccionado)
  '&:hover': {
    backgroundColor: 'grey.200',
  },
};


export {
  toggleButtonStyles
}