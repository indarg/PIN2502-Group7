// snackbar.bridge.ts

import TSnackbarMessage from "src/models/TSnackbarMessage";

let snackbarHandler: ((message: TSnackbarMessage) => void) | null = null;

export const registerSnackbar = (handler: (message: TSnackbarMessage) => void) => {
  snackbarHandler = handler;
};

export const showSnackbar = (message: TSnackbarMessage) => {
  snackbarHandler?.(message);
};
