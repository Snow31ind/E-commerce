import {
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  TextField,
  Link,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Layout from '../layouts/Layout';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getError } from '../utils/errors';
import { Store } from '../utils/Store';
import NextLink from 'next/link';

export default function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { redicrect } = router.query;

  const { state, dispatch } = useContext(Store);
  const { user } = state;

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, []);

  const submitHandler = async ({ email, password }) => {
    closeSnackbar();

    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });

      const msg = 'Login successfully';
      enqueueSnackbar(msg, { variant: 'success' });
      dispatch({ type: 'USER_LOGIN', payload: data });
      router.push('/');
    } catch (err) {
      const errMsg = getError(err);
      enqueueSnackbar(errMsg, { variant: 'error' });
    }
  };

  return (
    <Layout title="TechNerds Login">
      <Card>
        <CardHeader component="div" title="Login" />
        <CardContent>
          <form onSubmit={handleSubmit(submitHandler)}>
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
                <Controller
                  name="password"
                  control={control}
                  defaultValue={''}
                  rules={{
                    required: true,
                    minLength: 6,
                  }}
                  render={({ field }) => (
                    <TextField
                      variant="outlined"
                      id="password"
                      fullWidth
                      label="Password"
                      inputProps={{ type: 'password' }}
                      error={Boolean(errors.password)}
                      helperText={
                        errors.password
                          ? errors.password.type === 'minLength'
                            ? 'Password is invalid'
                            : 'Password is required'
                          : ''
                      }
                      {...field}
                    />
                  )}
                ></Controller>
              </ListItem>

              <ListItem>
                <Button type="submit" variant="contained" fullWidth>
                  Login
                </Button>
              </ListItem>

              <ListItem>
                {"Don't have an account?"}
                <NextLink href="/register" passHref>
                  <Link>Register</Link>
                </NextLink>
              </ListItem>
            </List>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
}
