import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Store } from '../utils/Store';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import {
  Breadcrumbs,
  Card,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Link,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useStyles } from '../utils/styles';
import { useEffect } from 'react';
import axios from 'axios';
import NextLink from 'next/link';
import Image from 'next/image';
import { getError } from '../utils/errors';
import Layout from '../layouts/Layout';
import { formatPriceToVND } from '../utils/helpers';
import LoginModal from '../modals/LoginModal';
import {
  Home,
  NavigateNext,
  PointOfSale,
  ShoppingCart,
} from '@mui/icons-material';
import {
  CLEAR_CART,
  SAVE_PAYMENT_METHOD,
  SAVE_SHIPPING_ADDRESS,
} from '../constants/actionTypes';

export default function Checkout() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const {
    cartState: { shippingAddress, cart },
    cartDispatch,
    userState: { user },
  } = useContext(Store);
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [activeStep, setActiveStep] = React.useState(1);
  const [loading, setLoading] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  useEffect(() => {
    if (user) {
      if (shippingAddress) {
        setValue('name', shippingAddress.name);
        setValue('address', shippingAddress.address);
        setValue('phoneNumber', shippingAddress.phoneNumber);
      }

      setPaymentMethod(
        Cookies.get('paymentMethod')
          ? JSON.parse(Cookies.get('paymentMethod'))
          : ''
      );
    }
  }, []);

  const roundToTwo = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const openLoginModalHandler = () => {
    setOpenLoginModal(true);
  };

  const closeLoginModalHandler = () => {
    setOpenLoginModal(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const submitShippingAddressHandler = ({ name, address, phoneNumber }) => {
    const data = {
      name,
      address,
      phoneNumber,
    };
    cartDispatch({ type: SAVE_SHIPPING_ADDRESS, payload: data });
    handleNext();
  };

  const submitPaymentMethodHandler = (e) => {
    e.preventDefault();
    closeSnackbar();

    if (!paymentMethod) {
      const errorMessage = 'Payment is not selected';
      enqueueSnackbar(errorMessage, {
        variant: 'error',
      });
    } else {
      cartDispatch({ type: SAVE_PAYMENT_METHOD, payload: paymentMethod });
      // router.push('placeorder');
    }

    handleNext();
  };

  const placeOrderHandler = async () => {
    closeSnackbar();
    setLoading(true);

    const orderItems = cart.map((cartItem) => ({
      name: cartItem.name,
      quantity: cartItem.quantity,
      image: cartItem.images[0],
      price: cartItem.price,
    }));

    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );

      cartDispatch({ type: CLEAR_CART });
      setLoading(false);

      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);

      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  };

  const itemsPrice = cart.reduce((a, c) => a + c.quantity * c.price, 0);

  const shippingPrice = itemsPrice > 15000000 ? 0 : 100000;
  const taxPrice = roundToTwo(itemsPrice * 0.1);
  const totalPrice = roundToTwo(itemsPrice + shippingPrice + taxPrice);

  const steps = [
    {
      label: 'Login',
      page: (
        <Box>
          <Typography>Login to proceed your cart.</Typography>
          <Button variant="contained" onClick={openLoginModalHandler} fullWidth>
            Login
          </Button>

          <LoginModal
            open={openLoginModal}
            closeLoginModalHandler={closeLoginModalHandler}
            redirect="/checkout"
          />
        </Box>
      ),
    },
    {
      label: 'Assign shipping address',
      page: (
        <form onSubmit={handleSubmit(submitShippingAddressHandler)}>
          <List>
            {/* User name */}
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
                          ? 'Name must have at least 6 characters'
                          : 'Name is required'
                        : ''
                    }
                    {...field}
                  />
                )}
              ></Controller>
            </ListItem>

            {/* User address */}
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
                    label="Shipping address"
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

            {/* User phone number */}
            <ListItem>
              <Controller
                name="phoneNumber"
                control={control}
                defaultValue={''}
                rules={{
                  required: true,
                  minLength: 6,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    id="phoneNumber"
                    fullWidth
                    label="Phone number"
                    inputProps={{ type: 'text' }}
                    error={Boolean(errors.phoneNumber)}
                    helperText={
                      errors.phoneNumber
                        ? errors.phoneNumber.type === 'minLength'
                          ? 'Address must have at least 6 characters'
                          : 'Address is required'
                        : ''
                    }
                    {...field}
                  />
                )}
              ></Controller>
            </ListItem>

            {/* Submit button */}
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
      ),
    },
    {
      label: 'Select payment method',
      description:
        'An ad group contains one or more ads which target a shared set of keywords.',
      page: (
        <form onSubmit={submitPaymentMethodHandler}>
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
                onClick={handleBack}
              >
                Back
              </Button>
            </ListItem>
          </List>
        </form>
      ),
    },
    {
      label: 'Confirm the order',
      description: `Try out different ad text to see what brings in the most customers,
                and learn how to enhance your ads using features like ad extensions.
                If you run into any problems with your ads, find out how to tell if
                they're running and how to resolve approval issues.`,
      page: shippingAddress ? (
        <Box>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography>Shipping Address</Typography>
              </ListItem>
              <ListItem>
                {shippingAddress.name},{shippingAddress.address},{' '}
                {shippingAddress.phoneNumber}
              </ListItem>
            </List>
          </Card>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography>Payment Method</Typography>
              </ListItem>
              <ListItem>{paymentMethod}</ListItem>
            </List>
          </Card>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography>Order Items</Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <NextLink href={`/products/${item.slug}`} passHref>
                              <Link>
                                <Image
                                  src={item.images[0]}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                />
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell>
                            <NextLink href={`/products/${item.slug}`} passHref>
                              <Link>
                                <Typography>{item.name}</Typography>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>{item.quantity}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>
                              {`${formatPriceToVND(item.price)} VND`}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>

              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={placeOrderHandler}
                  color="secondary"
                  sx={{ color: 'white' }}
                >
                  {loading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    'Confirm'
                  )}
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleBack}
                  color="secondary"
                >
                  BACK
                </Button>
              </ListItem>
            </List>
          </Card>
        </Box>
      ) : (
        <div>Loading</div>
      ),
    },
  ];

  return (
    <Layout title="Checkout">
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box>
              <Breadcrumbs separator={<NavigateNext />}>
                <NextLink href="/" passHref>
                  <Link
                    underline="hover"
                    color="inherit"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Home sx={{ mr: 0.5 }} />
                    Homepage
                  </Link>
                </NextLink>

                <NextLink href={`/cart`} passHref>
                  <Link
                    underline="hover"
                    color="inherit"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'black',
                    }}
                  >
                    <ShoppingCart sx={{ mr: 0.5 }} color="inherit" />
                    <Typography color="text.primary">Cart</Typography>
                  </Link>
                </NextLink>

                <NextLink href={`/checkout`} passHref>
                  <Link
                    underline="hover"
                    color="inherit"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'black',
                    }}
                  >
                    <PointOfSale sx={{ mr: 0.5 }} color="inherit" />
                    <Typography color="text.primary" fontWeight="bold">
                      Checkout
                    </Typography>
                  </Link>
                </NextLink>
              </Breadcrumbs>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box>
              <Stepper
                activeStep={user ? activeStep : 0}
                orientation="vertical"
              >
                {steps.map((step) => (
                  <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                    <StepContent>
                      {step.page}
                      {/* <Box sx={{ mb: 2 }}>
                        <div>
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {index === steps.length - 1 ? 'Finish' : 'Continue'}
                          </Button>
                          {index > 0 && (
                            <Button
                              disabled={index === 0}
                              onClick={handleBack}
                              sx={{ mt: 1, mr: 1 }}
                            >
                              Back
                            </Button>
                          )}
                        </div>
                      </Box> */}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </Button>
              </Paper>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography>Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">{`${formatPriceToVND(
                        itemsPrice
                      )} VND`}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">{`${formatPriceToVND(
                        taxPrice
                      )} VND`}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">{`${formatPriceToVND(
                        shippingPrice
                      )} VND`}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        <strong>{`${formatPriceToVND(totalPrice)} VND`}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
