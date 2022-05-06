import {
  Box,
  Button,
  capitalize,
  Card,
  CardContent,
  Grid,
  Link,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../layouts/Layout';
import { Store } from '../utils/Store';
import NextLink from 'next/link';
import NextImage from 'next/image';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
  ChevronRight,
  Discount,
  ShoppingCartOutlined,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import CartItem from '../components/CartItem/CartItem';
import { useStyles } from '../utils/styles';
import { formatPriceToVND } from '../utils/helpers';
import {
  ADD_TO_CART,
  DECREASE_ITEM_QUANTITY_TO_CART,
  FETCH_CART,
  FULFILLED,
  PENDING,
  REMOVE_FROM_CART,
  REMOVE_ITEM,
  UPDATE_ITEM_QUANTITY,
} from '../constants/actionTypes';
import { fetchItemById } from '../actions/cart';

export default function Cart() {
  const {
    cartState: { items, loading, cart },
    cartDispatch,
  } = useContext(Store);

  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const classes = useStyles();

  useEffect(() => {
    const fetchCart = async () => {
      cartDispatch({ type: PENDING });
      var cart = [];

      for (var item of items) {
        const purchasedProduct = await fetchItemById(item._id);
        cart = [...cart, { ...purchasedProduct, quantity: item.quantity }];
      }

      cartDispatch({ type: FETCH_CART, payload: cart });
      cartDispatch({ type: FULFILLED });
    };

    fetchCart();
  }, []);

  const removeFromCartHandler = (item) => {
    closeSnackbar();

    cartDispatch({ type: REMOVE_ITEM, payload: item._id });

    const msg = `${capitalize(item.category)} ${item.name} removed from cart`;
    enqueueSnackbar(msg, { variant: 'success' });
  };

  const increaseItemQuantityHandler = (item) => {
    cartDispatch({
      type: UPDATE_ITEM_QUANTITY,
      payload: { _id: item._id, quantity: 1 },
    });
  };

  const decreaseItemQuantityHandler = (item) => {
    cartDispatch({
      type: UPDATE_ITEM_QUANTITY,
      payload: { _id: item._id, quantity: -1 },
    });
  };

  const subTotal = cart.reduce(
    (acc, next) => acc + next.quantity * parseInt(next.price),
    0
  );

  const roundToTwo = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const shipping = subTotal > 15000000 ? 0 : 100000;

  const taxes = roundToTwo(subTotal * 0.1);

  const discount = 0;

  const total = subTotal + shipping + taxes - discount;

  if (loading) {
    return <Box>Loading</Box>;
  }

  return (
    <Layout title="Shopping cart">
      <Box>
        {cart.length ? (
          <Grid container spacing={2}>
            <Grid item container xl={8} md={8} xs={12} spacing={2}>
              <List sx={{ flex: 1, maxHeight: 600, overflow: 'auto' }}>
                {cart.map((cartItem) => (
                  <ListItem key={cartItem._id}>
                    <Grid item xs={12} md={12} xl={12}>
                      <CartItem
                        product={cartItem}
                        decreaseItemQuantityHandler={
                          decreaseItemQuantityHandler
                        }
                        increaseItemQuantityHandler={
                          increaseItemQuantityHandler
                        }
                        removeFromCartHandler={removeFromCartHandler}
                      />
                    </Grid>
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item container xl={4} md={4} xs={12} spacing={2}>
              <List sx={{ flex: 1 }}>
                <ListItem>
                  <Grid item xl={12}>
                    <Card>
                      <CardContent>
                        <List>
                          <ListItem>
                            <Box className={classes.flex} sx={{ flex: 1 }}>
                              <Typography>Subtotal</Typography>
                              <div className={classes.grow}></div>
                              <Typography textAlign="right">{`${formatPriceToVND(
                                subTotal
                              )} VND`}</Typography>
                            </Box>
                          </ListItem>

                          <ListItem>
                            <Box className={classes.flex} sx={{ flex: 1 }}>
                              <Typography>Shipping</Typography>
                              <div className={classes.grow}></div>
                              <Typography textAlign="right">{`${formatPriceToVND(
                                shipping
                              )}  VND`}</Typography>
                            </Box>
                          </ListItem>

                          <ListItem>
                            <Box className={classes.flex} sx={{ flex: 1 }}>
                              <Typography>Taxes</Typography>
                              <div className={classes.grow}></div>
                              <Typography textAlign="right">{`${formatPriceToVND(
                                taxes
                              )} VND`}</Typography>
                            </Box>
                          </ListItem>

                          <ListItem>
                            <Box className={classes.flex} sx={{ flex: 1 }}>
                              <Typography>Discount</Typography>
                              <div className={classes.grow}></div>
                              <Typography textAlign="right">{`${formatPriceToVND(
                                discount
                              )}  VND`}</Typography>
                            </Box>
                          </ListItem>

                          <ListItem>
                            <Box className={classes.flex} sx={{ flex: 1 }}>
                              <Typography>Total</Typography>
                              <div className={classes.grow}></div>
                              <Typography textAlign="right">{`${formatPriceToVND(
                                total
                              )} VND`}</Typography>
                            </Box>
                          </ListItem>

                          <ListItem>
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => router.push('/checkout')}
                              endIcon={<ChevronRight />}
                            >
                              Checkout
                            </Button>
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        ) : (
          <Paper className={classes.emptyCart}>
            <ShoppingCartOutlined color="error" sx={{ mb: 5 }} />
            <Typography>{`Empty cart`}</Typography>
            <Typography>{`Let's go shopping`}</Typography>
            <NextLink href={'/'} passHref>
              <Link>
                <Typography>{`Home`}</Typography>
              </Link>
            </NextLink>
          </Paper>
        )}
      </Box>
    </Layout>
  );
}
