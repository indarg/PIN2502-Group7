import TCRMCommonState from "src/models/states/TCRMCommonState";
import TConfirmationModal from "src/models/TConfirmationModal";
import TConfirmationModalAsync from "src/models/TConfirmationModalAsync";
import { TCurrency } from "src/models/TSerie";
import TSnackbarMessage from "src/models/TSnackbarMessage";

type CRMCommonAction =
    | { type: 'setSnackbarMessage', payload: TSnackbarMessage }
    | { type: 'setLoading', payload: boolean }
    | { type: 'setHash', payload: string }
    | { type: 'setConfirmationModal', payload: TConfirmationModal | null }
    | { type: 'setConfirmationModalAsync', payload: TConfirmationModalAsync | null }
    | { type: 'setChangesMade', payload: boolean }





export const CRMCommonReducer = (state: TCRMCommonState, action: CRMCommonAction): TCRMCommonState => {

    switch (action.type) {
        case 'setChangesMade':
            return {
                ...state,
                changesMade: action.payload
            };
        case 'setSnackbarMessage':
            return {
                ...state,
                snackbarMessage: action.payload
            };
        case 'setLoading':
            return {
                ...state,
                isLoading: action.payload
            };
        case 'setHash':
            return {
                ...state,
                hash: action.payload
            };
        case 'setConfirmationModal':
            return {
                ...state,
                confirmationModal: action.payload
            };
        case 'setConfirmationModalAsync':
            return {
                ...state,
                confirmationModalAsync: action.payload
            };
        default:
            return state;
    }
};