import {
  Button,
  capitalize,
  Card,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../layouts/Layout';
import { Store } from '../utils/Store';
import NextLink from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Add, Remove } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';

export default function Shipping() {
  const { state, dispatch } = useContext(Store);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const {
    cart: { shippingAddress },
    user,
  } = state;
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/shipping');
    }

    if (shippingAddress) {
      setValue('fullName', shippingAddress.fullName);
      setValue('address', shippingAddress.address);
      setValue('city', shippingAddress.city);
      setValue('postalCode', shippingAddress.postalCode);
      setValue('country', shippingAddress.country);
    }
  }, []);

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    const data = {
      fullName,
      address,
      city,
      postalCode,
      country,
    };
    dispatch({ type: 'SAVE_SHIPPING_ADDRESS', payload: data });
    router.push('/payment');
  };

  return (
    <Layout title="Shipping">
      <CheckoutWizard activeStepIndex={1} />
      <form onSubmit={handleSubmit(submitHandler)}>
        <Typography component="h1" variant="h11">
          Shipping
        </Typography>

        <List>
          <ListItem>
            <Controller
              name="fullName"
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  id="fullName"
                  fullWidth
                  label="Full Name"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === 'minLength'
                        ? 'Full name must have at least 6 characters'
                        : 'Full name is required'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="address"
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  id="address"
                  fullWidth
                  label="Address"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? errors.address.type === 'minLength'
                        ? 'Address must have at least 6 characters'
                        : 'Address is required'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="city"
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  id="city"
                  fullWidth
                  label="City"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === 'minLength'
                        ? 'City must have at least 6 characters'
                        : 'City is required'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="postalCode"
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  id="postalCode"
                  fullWidth
                  label="Postal Code"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === 'minLength'
                        ? 'Postal code must have at least 6 characters'
                        : 'Postal code is required'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="country"
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  id="country"
                  fullWidth
                  label="Country"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country
                      ? errors.country.type === 'minLength'
                        ? 'Country must have at least 6 characters'
                        : 'Country is required'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              color="secondary"
            >
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
