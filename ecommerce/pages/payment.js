import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../layouts/Layout';
import { Store } from '../utils/Store';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import CheckoutWizard from '../components/CheckoutWizard';
import Cookies from 'js-cookie';

export default function Payment() {
  const { state, dispatch } = useContext(Store);
  const { user } = state;
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }

    setPaymentMethod(
      Cookies.get('paymentMethod')
        ? JSON.parse(Cookies.get('paymentMethod'))
        : ''
    );
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    closeSnackbar();

    if (!paymentMethod) {
      const errorMessage = 'Payment is not selected';
      enqueueSnackbar(errorMessage, {
        variant: 'error',
      });
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      router.push('placeorder');
    }
  };

  return (
    <Layout title="Payment method">
      <CheckoutWizard activeStepIndex={2} />
      <form onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Payment Method
        </Typography>

        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Payment Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Stripe"
                  value="Stripe"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Cash"
                  value="Cash"
                  control={<Radio />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>

          <ListItem>
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              type="submit"
            >
              Continue
            </Button>
          </ListItem>

          <ListItem>
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              onClick={() => router.push('/shipping')}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
