import {
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  TextField,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Layout from '../layouts/Layout';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getError } from '../utils/errors';
import { Store } from '../utils/Store';
import NextLink from 'next/link';
import { DesktopDatePicker } from '@mui/lab';
import { useStyles } from '../utils/styles';

export default function Regiser() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const classes = useStyles();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { redicrect } = router.query;

  const { state, dispatch } = useContext(Store);

  const [birth, setBirth] = useState(new Date());
  const [gender, setGender] = useState('None');

  const submitHandler = async ({
    name,
    phoneNumber,
    address,
    email,
    password,
    confirmPassword,
  }) => {
    closeSnackbar();

    if (confirmPassword !== password) {
      const errMsg = 'Password not match';
      enqueueSnackbar(errMsg, { variant: 'error' });
      return;
    }

    try {
      const { data } = await axios.post('/api/users/register', {
        name,
        birth,
        gender,
        phoneNumber,
        address,
        email,
        password,
      });

      const msg = 'Register successfully! Now login your new account!';
      enqueueSnackbar(msg, { variant: 'success' });

      dispatch({ type: 'USER_LOGIN', payload: data });
      router.push('/login');
    } catch (err) {
      const errMsg = err.response.data
        ? err.response.data.message
        : err.message;
      enqueueSnackbar(errMsg, { variant: 'error' });
    }
  };

  return (
    <Layout title="TechNerds Login">
      <Card>
        <CardHeader component="div" title="Register" />
        <CardContent>
          <form onSubmit={handleSubmit(submitHandler)}>
            <List>
              <ListItem>
                <Controller
                  name="name"
                  control={control}
                  defaultValue={''}
                  rules={{
                    required: true,
                    minLength: 6,
                  }}
                  render={({ field }) => (
                    <TextField
                      variant="outlined"
                      id="name"
                      fullWidth
                      label="Name"
                      inputProps={{ type: 'text' }}
                      error={Boolean(errors.name)}
                      helperText={
                        errors.name
                          ? errors.name.type === 'minLength'
                            ? 'Name is invalid'
                            : 'Name is required'
                          : ''
                      }
                      {...field}
                    />
                  )}
                ></Controller>
              </ListItem>

              <ListItem>
                <DesktopDatePicker
                  label="Birthday"
                  value={birth}
                  onChange={(date) => setBirth(date)}
                  renderInput={(params) => <TextField {...params} />}
                />

                <div className={classes.grow}></div>

                <FormControl sx={{ width: 180 }}>
                  <InputLabel id="birth-selector">Gender</InputLabel>
                  <Select
                    labelId="birth-selector"
                    id="birth"
                    value={gender}
                    label="Gender"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Binary">Binary</MenuItem>
                    <MenuItem value="Secret">Prefer not to tell</MenuItem>
                    <MenuItem value="None">None</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>

              <ListItem>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue={''}
                  rules={{
                    required: true,
                    minLength: 10,
                  }}
                  render={({ field }) => (
                    <TextField
                      variant="outlined"
                      id="phoneNumber"
                      fullWidth
                      label="Phone number"
                      inputProps={{ type: 'number' }}
                      error={Boolean(errors.phoneNumber)}
                      helperText={
                        errors.phoneNumber
                          ? errors.phoneNumber.type === 'minLength'
                            ? 'Phone number is invalid'
                            : 'Phone number is required'
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
                    minLength: 5,
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
                            ? 'Address is invalid'
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
                      error={Boolean(errors.passwod)}
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
                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue={''}
                  rules={{
                    required: true,
                    minLength: 6,
                  }}
                  render={({ field }) => (
                    <TextField
                      variant="outlined"
                      id="confirmPassword"
                      fullWidth
                      label="Confirm Password"
                      inputProps={{ type: 'password' }}
                      error={Boolean(errors.passwod)}
                      helperText={
                        errors.confirmPassword
                          ? errors.confirmPassword.type === 'minLength'
                            ? 'Confirm password is invalid'
                            : 'Confirm password is required'
                          : ''
                      }
                      {...field}
                    />
                  )}
                ></Controller>
              </ListItem>

              <ListItem>
                <Button type="submit" variant="contained" fullWidth>
                  Register
                </Button>
              </ListItem>

              <ListItem>
                {'Already have an account?'}
                <NextLink href="/login" passHref>
                  <Link>Login</Link>
                </NextLink>
              </ListItem>
            </List>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
}
