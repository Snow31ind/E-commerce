import { LocalizationProvider } from '@mui/lab';
import { SnackbarProvider } from 'notistack';
import '../styles/globals.css';
import { StoreProvider } from '../utils/Store';
import DateAdapter from '@mui/lab/AdapterDateFns';

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
          <Component {...pageProps} />
        </StoreProvider>
      </LocalizationProvider>
    </SnackbarProvider>
  );
}

export default MyApp;
