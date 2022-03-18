import { Button, List, ListItem, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import Layout from '../layouts/Layout';

export default function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const submitHandler = ({ email, password }) => {};

  return (
    <Layout title="TechNerds Login">
      <form onSubmit={handleSubmit(submitHandler)}>
        <Typography>Login</Typography>
        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  id="email"
                  fullWidth
                  label="Email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.mail
                      ? errors.mail.type === 'pattern'
                        ? 'Email is invalid'
                        : 'Email is required'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" fullWidth>
              Login
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
