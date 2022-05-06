import { LocalizationProvider } from '@mui/lab';
import { SnackbarProvider } from 'notistack';
import '../styles/globals.css';
import { StoreProvider } from '../utils/Store';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({});

function MyApp({ Component, pageProps }) {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <LocalizationProvider dateAdapter={DateAdapter}>
        <StoreProvider>
          <PayPalScriptProvider>
            <ThemeProvider theme={theme}>
              <Component {...pageProps} />
            </ThemeProvider>
          </PayPalScriptProvider>
        </StoreProvider>
      </LocalizationProvider>
    </SnackbarProvider>
  );
}

export default MyApp;
