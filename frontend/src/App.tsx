import { ThemeProvider } from '@emotion/react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { esES as datePickerEsES } from '@mui/x-date-pickers/locales'
import './App.css'
import MainRouter from './routers/MainRouter'
import theme from './shared/material_styles/Theme'
import { useSnackbar } from './context/snackbar-context/snackbar.provider'
import { registerSnackbar } from './bridges/snackbar.bridge'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext/AuthProvider'
import { BrowserRouter } from 'react-router-dom'
function App() {
  const { setSnackbarMessage } = useSnackbar();

  useEffect(() => {
    registerSnackbar(setSnackbarMessage);
  }, [setSnackbarMessage]);
  return (


    <div className='app'>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}
          localeText={datePickerEsES.components.MuiLocalizationProvider.defaultProps.localeText}
        >
            <AuthProvider>
              <MainRouter />
            </AuthProvider>

        </LocalizationProvider>
      </ThemeProvider>

    </div>
  )
}

export default App;
