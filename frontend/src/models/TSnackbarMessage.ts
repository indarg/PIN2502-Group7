type TSnackbarMessage = {
    severity?: SnackbarSeverity;
    title: string;
    message?: string;
    duration?: number;
    show?: boolean
}

export default TSnackbarMessage;

type SnackbarSeverity = 'success' | 'info' | 'warning' | 'error';


export const resolveSuccessMessage = (message: string) => {
    return {
        title: '¡Todo ha salido perfecto!',
        duration: 3000,
        message,
        severity: 'success',
        show: true
    } as TSnackbarMessage
}
export const resolveErrorMessage = (message: string = 'Intente nuevamente o contacte a soporte') => {
    return {
        title: '¡Algo ha salido mal!',
        duration: 3000,
        message,
        severity: 'error',
        show: true
    } as TSnackbarMessage
}

export const formError = (message: string = 'El formulario contiene al menos un error, por favor compruebe') => {
    return {
        title: '¡No se pudo enviar el formulario!',
        duration: 3000,
        message,
        severity: 'warning',
        show: true
    } as TSnackbarMessage
}

export class CustomError extends Error {
  constructor(
    message: string,
    public severity:SnackbarSeverity = 'error',
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ValidationError';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}
