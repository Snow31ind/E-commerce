import React, { useContext, useEffect, useReducer, useState } from 'react';
import db from '../../utils/db';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
import Layout from '../../layouts/Layout';
import {
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
import { slugify } from '../../utils/helpers';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return { ...state, loading: true };
    }
    case 'FETCH_SUCCESS': {
      return { ...state, loading: false, order: action.payload, error: '' };
    }
    case 'FETCH_FAILED': {
      return { ...state, loading: false, error: action.payload };
    }
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

  const [{ loading, order, error }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

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
    }
  }, [order]);

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

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <Layout title={`Order ${orderId}`}>
      <Typography>Order Detail</Typography>

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
                  <Typography>Shipping Address</Typography>
                </ListItem>

                <ListItem>
                  {shippingAddress.fullName},{shippingAddress.address},{' '}
                  {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                  {shippingAddress.country},{' '}
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
                              <Typography>{`$ ${item.price}`}</Typography>
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

          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h2">Order Summary</Typography>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">{`${itemsPrice} VND`}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">{`${taxPrice} VND`}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">{`${shippingPrice} VND`}</Typography>
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
                        <strong>{`${totalPrice} VND`}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
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
