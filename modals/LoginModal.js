import {
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  TextField,
  Link,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Box,
  CircularProgress,
  Modal,
  Fade,
  Backdrop,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { getError } from '../utils/errors';
import { Store } from '../utils/Store';
import { useStyles } from '../utils/styles';
import NextImage from 'next/image';
import { DesktopDatePicker } from '@mui/lab';
import {
  FULFILLED,
  PENDING,
  REJECTED,
  SIGNIN,
  SIGNUP,
} from '../constants/actionTypes';
import { signIn, signUp } from '../actions/user';

export default function LoginModal(props) {
  const { open, closeLoginModalHandler } = props;
  const { redirect } = props;

  const classes = useStyles();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();

  const {
    userState: { loading },
    userDispatch,
  } = useContext(Store);

  const [isSigningIn, setIsSigningIn] = useState(true);

  const submitHandler = async ({
    email,
    password,
    confirmPassword,
    name,
    birth,
    gender,
    phoneNumber,
    address,
  }) => {
    closeSnackbar();
    userDispatch({ type: PENDING });

    if (isSigningIn) {
      try {
        const user = await signIn({ email, password });
        userDispatch({ type: SIGNIN, payload: user });
        userDispatch({ type: FULFILLED });

        enqueueSnackbar('Successfully sign in', { variant: 'success' });
        router.push(redirect || '/');
      } catch (error) {
        enqueueSnackbar(getError(error), { variant: 'error' });
        userDispatch({ type: REJECTED, payload: getError(error) });
      }
    } else {
      if (password !== confirmPassword) {
        userDispatch({
          type: REJECTED,
          payload: 'Confirm password is different from the password.',
        });

        enqueueSnackbar('Confirm password is different from the password.', {
          variant: 'error',
        });

        return;
      }

      try {
        console.log({
          name,
          phoneNumber,
          address,
          birth,
          gender,
          email,
          password,
          confirmPassword,
        });

        const user = await signUp({
          name,
          birth,
          gender,
          address,
          phoneNumber,
          email,
          password,
        });
        console.log(user);
        userDispatch({ type: SIGNUP, payload: user });
        userDispatch({ type: FULFILLED });

        enqueueSnackbar('Successfully sign in', { variant: 'success' });
        router.push(redirect || '/');
      } catch (error) {
        enqueueSnackbar(getError(error), { variant: 'error' });
        userDispatch({ type: REJECTED, payload: getError(error) });
      }
    }

    closeLoginModalHandler();
  };

  const toggleFormActionHandler = () => {
    setIsSigningIn(!isSigningIn);
  };

  return (
    <Modal
      open={open}
      onClose={closeLoginModalHandler}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 700,
      }}
    >
      <Fade in={open}>
        <Box className={classes.modal}>
          {/* Main section */}
          <Card className={classes.loginCard}>
            <CardContent className={classes.loginHeader}>
              <NextImage src={'/logos/logo2.png'} width={250} height={150} />
            </CardContent>
            <CardContent className={classes.loginContent}>
              {/* <Typography className={classes.loginText}>Sign In</Typography> */}
              <CardHeader
                title={<Typography variant="h4">Sign In</Typography>}
                subheader="Join in the crew"
              />
              <form onSubmit={handleSubmit(submitHandler)}>
                <List>
                  {/* Name */}
                  {!isSigningIn && (
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
                  )}

                  {/* birth and gender */}
                  {!isSigningIn && (
                    <ListItem>
                      <Controller
                        name="birth"
                        control={control}
                        defaultValue={new Date()}
                        rules={{
                          required: true,
                          minLength: 1,
                        }}
                        render={({ field }) => (
                          <DesktopDatePicker
                            label="Birthday"
                            {...field}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        )}
                      />
                      {/* <DesktopDatePicker
                        label="birth"
                        value={birth}
                        onChange={(date) => setBirth(date)}
                        renderInput={(params) => <TextField {...params} />}
                      /> */}
                      <div className={classes.grow}></div>
                      <Controller
                        name="gender"
                        control={control}
                        defaultValue={'Male'}
                        render={({ field }) => (
                          <FormControl sx={{ width: 180 }}>
                            <InputLabel id="birth-selector">Gender</InputLabel>
                            <Select
                              labelId="birth-selector"
                              id="birth"
                              // value={gender}
                              label="Gender"
                              // onChange={(e) => setGender(e.target.value)}
                              {...field}
                            >
                              <MenuItem value="Male">Male</MenuItem>
                              <MenuItem value="Female">Female</MenuItem>
                              <MenuItem value="Binary">Binary</MenuItem>
                              <MenuItem value="Prefer not to tell">
                                Prefer not to tell
                              </MenuItem>
                              <MenuItem value="None">None</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </ListItem>
                  )}

                  {/* Phone number */}
                  {!isSigningIn && (
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
                  )}

                  {/* Address */}
                  {!isSigningIn && (
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
                  )}

                  {/* Email */}
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
                          autoComplete="username"
                          autoFocus
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

                  {/* Password */}
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
                          autoComplete="new-password"
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

                  {/* Confirm password */}
                  {!isSigningIn && (
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
                            autoComplete="new-password"
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
                  )}

                  {/* Remember me */}
                  <ListItem>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Remember me"
                      />
                    </FormGroup>
                  </ListItem>

                  {/* Button */}
                  <ListItem>
                    <Button type="submit" variant="contained" fullWidth>
                      {loading ? (
                        <CircularProgress color="inherit" size={24} />
                      ) : isSigningIn ? (
                        'SIGN IN'
                      ) : (
                        'SIGN UP'
                      )}
                    </Button>
                  </ListItem>
                </List>
              </form>
              <Box sx={{ display: 'flex' }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={toggleFormActionHandler}
                >
                  {isSigningIn
                    ? 'Not have an account yet? Sign up'
                    : 'Already have an account? Sign in'}
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </Modal>
  );
}
