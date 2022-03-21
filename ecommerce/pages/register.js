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
  Typography,
  CircularProgress,
  Box,
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
import NextImage from 'next/image';
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
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
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
      setLoading(false);

      router.push('/login');
    } catch (err) {
      setLoading(false);

      const errMsg = err.response.data
        ? err.response.data.message
        : err.message;
      enqueueSnackbar(errMsg, { variant: 'error' });
    }
  };

  return (
    <Layout
      title="TechNerds Login"
      alignItems="center"
      display="flex"
      flexDirection="column"
      pt={10}
    >
      <Card sx={{ width: 800 }}>
        <CardContent className={classes.loginHeader}>
          <NextImage
            src={'/logo.png'}
            width={140}
            height={120}
            // variant="rounded"
            // sx={{ height: 150, width: 150 }}
          />
          <Typography className={classes.loginText}>Register</Typography>
        </CardContent>

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
                      autoFocus
                      variant="outlined"
                      id="name"
                      fullWidth
                      label="Name *"
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
                      label="Phone number *"
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
                      label="Address *"
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
                      label="Email *"
                      inputProps={{ type: 'email' }}
                      error={Boolean(errors.email)}
                      helperText={
                        errors.email
                          ? errors.email.type === 'pattern'
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
                      label="Password *"
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
                      label="Confirm Password *"
                      inputProps={{ type: 'password' }}
                      error={Boolean(errors.confirmPassword)}
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
                <Button
                  type="submit"
                  variant={loading ? 'text' : 'contained'}
                  fullWidth
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress /> : `Register`}
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
