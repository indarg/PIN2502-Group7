import { createContext, useContext, useState } from 'react';
import TSnackbarMessage from 'src/models/TSnackbarMessage';
import SnackbarComponent from 'src/shared/components/snackbar/snackbar-message';

type SnackbarContextType = {
    setSnackbarMessage: (message: TSnackbarMessage) => void;
};

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [snackbar, setSnackbar] = useState<TSnackbarMessage | null>(null);

    const setSnackbarMessage = (message: TSnackbarMessage) => {
        setSnackbar(message);
    };

    return (
        <SnackbarContext.Provider value={{ setSnackbarMessage }}>
            {children}

            {/* Your MUI Snackbar component */}
            {snackbar?.show && (

                <SnackbarComponent
                    {...snackbar}
                    onClose={() =>
                        setSnackbarMessage({
                            show: false,
                            title: '',
                            message: '',
                            severity: 'success',
                        })
                    }
                />

            )}
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const ctx = useContext(SnackbarContext);
    if (!ctx) {
        throw new Error('useSnackbar must be used inside SnackbarProvider');
    }
    return ctx;
};
