import React, { useContext, useEffect, useReducer, useState } from 'react';
import db from '../../utils/db';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
import Layout from '../../layouts/Layout';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/errors';
import { useStyles } from '../../utils/styles';
import NextLink from 'next/link';
import NextImage from 'next/image';
import { formatPriceToVND, slugify } from '../../utils/helpers';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

const VND_TO_USD = 22878;

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAILED':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAILED':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, errorPay: '', successPay: false };
    default:
      return state;
  }
}

export default function OrderScreen({ orderId }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    state: { user },
  } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();

  const [{ loading, order, error, successPay }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      order: {},
      error: '',
    }
  );

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  useEffect(() => {
    if (!user) {
      return router.push('/login');
    }

    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        });

        console.log(data);

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILED', payload: getError(error) });

        enqueueSnackbar(error, { variant: 'error' });
      }
    };

    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();

      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        });

        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });

        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };

      loadPaypalScript();
    }
  }, [order, successPay]);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
  } = order;

  const roundToTwo = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: roundToTwo(totalPrice / VND_TO_USD) },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${orderId}/pay`,
          details,
          {
            headers: {
              authorization: `Bearer ${user.token}`,
            },
          }
        );

        dispatch({ type: 'PAY_SUCCESS', payload: data });
        enqueueSnackbar('Order is paid', {
          variant: 'success',
        });
      } catch (err) {
        dispatch({ type: 'PAY_FAILED', payload: data });
        enqueueSnackbar(getError(err), {
          variant: 'error',
        });
      }
    });
  };

  const onError = (err) => {
    enqueueSnackbar(getError(err), {
      variant: 'error',
    });
  };

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <Layout title={`Order ${orderId}`}>
      <Box className={classes.main}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography className={classes.error}>{error}</Typography>
        ) : (
          <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography>Customer Information</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      {shippingAddress.name}
                      {' - '}
                      {shippingAddress.address}
                      {' - '}
                      {shippingAddress.phoneNumber}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>Payment Method</Typography>
                  </ListItem>
                  <ListItem>{paymentMethod}</ListItem>
                </List>
              </Card>
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography>Ordered Items</Typography>
                  </ListItem>
                  <ListItem>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Item Name</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderItems.map((item) => (
                            <TableRow key={item._id}>
                              <TableCell>
                                <NextLink
                                  href={`/products/${slugify(item.name)}`}
                                  passHref
                                >
                                  <Link>
                                    <NextImage
                                      src={item.image}
                                      alt={item.name}
                                      width={50}
                                      height={50}
                                    />
                                  </Link>
                                </NextLink>
                              </TableCell>
                              <TableCell>
                                <NextLink
                                  href={`/products/${slugify(item.name)}`}
                                  passHref
                                >
                                  <Link>
                                    <Typography>{item.name}</Typography>
                                  </Link>
                                </NextLink>
                              </TableCell>
                              <TableCell align="right">
                                <Typography>{item.quantity}</Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography>{` ${formatPriceToVND(
                                  item.price
                                )} VND`}</Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </ListItem>
                </List>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography>Order History</Typography>
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
                          <strong>{`${formatPriceToVND(
                            totalPrice
                          )} VND`}</strong>
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  {paymentMethod === 'PayPal' && !isPaid && (
                    <ListItem>
                      <Grid container>
                        <Grid item xs={12} md={12} xl={12}>
                          {isPending ? (
                            <CircularProgress />
                          ) : (
                            <PayPalButtons
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onError}
                            />
                          )}
                        </Grid>
                      </Grid>
                    </ListItem>
                  )}
                </List>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const {
    params: { id },
  } = context;

  return {
    props: {
      orderId: id,
    },
  };
}
