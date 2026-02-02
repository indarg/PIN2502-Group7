import { createContext, RefObject } from 'react';
import TCRMCommonState from 'src/models/states/TCRMCommonState';
import TConfirmationModalAsync from 'src/models/TConfirmationModalAsync';
import TConfirmationModal from 'src/models/TConfirmationModal';
import TSnackbarMessage from 'src/models/TSnackbarMessage';


export type CRMCommonContextType = {
  setSnackbarMessage: (snackbarMessage: TSnackbarMessage) => void
  commonState: TCRMCommonState,
  setLoading: (value: boolean) => void,
  wrapperRef: RefObject<any>,
  setHash: (hash: string) => void,
  setConfirmationModal: (confirmationModal: TConfirmationModal | null) => void
  setConfirmationModalAsync: (confirmationModal: TConfirmationModalAsync | null) => void,
  setChangesMade: (value: boolean) => void,
  goFoward: (action: () => void) => void,
  handleExecution: (action: () => void) => void

}


export const CommonContext = createContext<CRMCommonContextType>({} as CRMCommonContextType);