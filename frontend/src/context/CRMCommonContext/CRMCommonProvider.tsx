import { ReactNode, useEffect, useReducer, useRef } from 'react';
import TCRMCommonState from 'src/models/states/TCRMCommonState';

import { useParams } from 'react-router-dom';
import TConfirmationModal from 'src/models/TConfirmationModal';
import TConfirmationModalAsync from 'src/models/TConfirmationModalAsync';
import TSnackbarMessage, { CustomError, resolveErrorMessage } from 'src/models/TSnackbarMessage';
import { CommonContext } from './CRMCommonContext';
import { CRMCommonReducer } from './CRMCommonReducer';


interface IProps {
    children: ReactNode
}
const INITIAL_STATE: TCRMCommonState = {
    isLoading: false,
    hash: '',
    snackbarMessage: {
        severity: "success",
        title: "",
        message: "",
        duration: 3000,
        show: false
    },
    confirmationModal: null,
    confirmationModalAsync: null,
    changesMade: false,

};


export const CRMCommonProvider = ({ children }: IProps) => {
    const [commonState, dispatch] = useReducer(CRMCommonReducer, INITIAL_STATE);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { hash } = useParams();

    const setSnackbarMessage = (snackbarMessage: TSnackbarMessage) => {
        dispatch({ type: 'setSnackbarMessage', payload: snackbarMessage });
    };

    const setLoading = (value: boolean) => {
        dispatch({ type: 'setLoading', payload: value });
    };

    const setConfirmationModal = (confirmationModal: TConfirmationModal | null) => {
        // message = "¿Está seguro de realizar esta acción?", action: () => Promise<TApiResponse<string>>, show = true
        dispatch({ type: 'setConfirmationModal', payload: confirmationModal });
    }

    const setConfirmationModalAsync = (confirmationModal: TConfirmationModalAsync | null) => {
        // message = "¿Está seguro de realizar esta acción?", action: () => Promise<TApiResponse<string>>, show = true
        dispatch({ type: 'setConfirmationModalAsync', payload: confirmationModal });
    }

    const setHash = (hash: string) => {
        dispatch({ type: 'setHash', payload: hash });
    };

    const setChangesMade = (value: boolean) => {
        dispatch({ type: 'setChangesMade', payload: value });
    };

    const goFoward = (action: () => void) => {
        setChangesMade(false);
        action();
    }

    const handleError = (error:unknown) => {
        if (error instanceof CustomError) {
            const {severity,message} = error;
            setSnackbarMessage({
                severity, message,
                title: '¡Algo ha salido mal!'
            })

        } else {
            setSnackbarMessage(resolveErrorMessage());
        }
    }
    const handleExecution = (action: () => void) => {
        try{
            action()
        }catch(error){
            handleError(error)
        }

    }


    useEffect(() => {
        if (hash)
            setHash(hash);
    }, [])



    return (
        <CommonContext.Provider value={{
            setSnackbarMessage,
            commonState,
            setLoading,
            wrapperRef,
            setHash,
            setConfirmationModal,
            setConfirmationModalAsync,
            setChangesMade,
            goFoward,
            handleExecution
        }}>
            {children}
        </CommonContext.Provider>
    );

};

