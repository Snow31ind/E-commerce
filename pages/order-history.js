import React, { useContext, useEffect, useReducer, useState } from 'react';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Layout from '../layouts/Layout';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
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
import { getError } from '../utils/errors';
import { useStyles } from '../utils/styles';
import NextLink from 'next/link';
import NextImage from 'next/image';
import { formatPriceToVND } from '../utils/helpers';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return { ...state, loading: true };
    }
    case 'FETCH_SUCCESS': {
      return { ...state, loading: false, orders: action.payload, error: '' };
    }
    case 'FETCH_FAILED': {
      return { ...state, loading: false, error: action.payload };
    }
    default:
      return state;
  }
}

export default function OrderHistory() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    userState: { user },
  } = useContext(Store);

  const router = useRouter();
  const classes = useStyles();

  const [{ loading, orders, error }, dispatch] = useReducer(reducer, {
    loading: false,
    orders: [],
    error: '',
  });

  useEffect(() => {
    if (!user) {
      return router.push('/login');
    }

    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        });

        console.log(data);

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILED', payload: getError(error) });
      }
    };

    fetchOrders();
  }, []);

  return (
    <Layout title="Order History">
      <Grid container spacing={1}>
        {/* Cart information */}
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              {/* <NextLink href="/profile" passHref>
                <ListItem button component="a">
                  <ListItemText primary="User profile"></ListItemText>
                </ListItem>
              </NextLink> */}

              <NextLink href="/profile" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Order History"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>

        <Grid item md={9} xs={12}>
          <Card className={classes.section}></Card>
          <List>
            <ListItem>
              {loading ? (
                <CircularProgress />
              ) : error ? (
                <Typography className={classes.error}>{error}</Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell align="right">Date</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Delivered</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>{order._id.substring(18, 24)}</TableCell>
                          <TableCell align="right">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">{`${formatPriceToVND(
                            order.totalPrice
                          )} VND`}</TableCell>
                          <TableCell>
                            {order.isPaid
                              ? `Paid at ${order.isPaid}`
                              : 'Not paid'}
                          </TableCell>
                          <TableCell>
                            {order.isDelivered
                              ? `Delivered at ${order.isPaid}`
                              : 'Yet delivered'}
                          </TableCell>
                          <TableCell>
                            <NextLink href={`/order/${order._id}`} passHref>
                              <Button variant="contained">Details</Button>
                            </NextLink>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Layout>
  );
}
