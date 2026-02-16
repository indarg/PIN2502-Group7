type TSnackbarMessage = {
    severity?: SnackbarSeverity;
    title: string;
    message?: string;
    duration?: number;
    show?: boolean
}

export default TSnackbarMessage;

type SnackbarSeverity = 'success' | 'info' | 'warning' | 'error';