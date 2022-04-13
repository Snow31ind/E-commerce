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

export default function Cart() {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItemIds },
  } = state;
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [cart, setCart] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await axios.get('/api/products');

      var list = [];

      cartItemIds.forEach((cartItemId) => {
        const item = data.products.find((item) => item._id === cartItemId);
        const existItem = list.find((item) => item._id === cartItemId);

        if (existItem) {
          list = [
            ...list.filter((item) => item._id !== cartItemId),
            { ...item, quantity: existItem.quantity + 1 },
          ];
        } else {
          list = [...list, { ...item, quantity: 1 }];
        }

        setCart(list);
      });
    };

    fetchItems();
  }, [cartItemIds]);

  const removeFromCartHanler = (item) => {
    closeSnackbar();

    dispatch({ type: 'REMOVE_FROM_CART', payload: item._id });

    const msg = `${capitalize(item.category)} ${item.name} removed from cart`;
    enqueueSnackbar(msg, { variant: 'success' });
  };

  const decreaseItemQuantityHandler = (item) => {
    dispatch({ type: 'DECREASE_ITEM_QUANTITY_TO_CART', payload: item._id });
  };

  const increaseItemQuantityHandler = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item._id });
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

  return (
    <Layout title="Shopping cart">
      <Box>
        {cartItemIds.length > 0 ? (
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
                        removeFromCartHanler={removeFromCartHanler}
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
