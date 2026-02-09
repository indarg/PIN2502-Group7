import { useContext } from 'react';
import { CommonContext } from './snackbar.context';





export const useCRMCommon = () => {

    const {
        commonState,
        setSnackbarMessage,
        setLoading,
        wrapperRef,
        setHash,
        setConfirmationModal,
        setConfirmationModalAsync,
        setChangesMade,
        goFoward,
        handleExecution
    } = useContext(CommonContext);
    const { snackbarMessage, isLoading, hash, confirmationModal, confirmationModalAsync, changesMade } = commonState;

    return {
        snackbarMessage,
        setSnackbarMessage,
        isLoading,
        setLoading,
        wrapperRef,
        hash,
        setHash,
        confirmationModal,
        setConfirmationModal,
        setConfirmationModalAsync,
        setChangesMade,
        confirmationModalAsync,
        changesMade,
        goFoward,
        handleExecution
    };
};


