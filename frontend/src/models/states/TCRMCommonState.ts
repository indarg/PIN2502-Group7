import { RefObject } from "react";
import TSnackbarMessage from "../TSnackbarMessage";
import TConfirmationModalAsync from "../TConfirmationModalAsync";
import TConfirmationModal from "../TConfirmationModal";
import { TCurrency } from "../TSerie";

type TCRMCommonState = {
    isLoading: boolean,
    snackbarMessage: TSnackbarMessage,
    hash: string,
    confirmationModal: TConfirmationModal | null,
    confirmationModalAsync: TConfirmationModalAsync | null,
    changesMade:boolean,

}

export default TCRMCommonState;

