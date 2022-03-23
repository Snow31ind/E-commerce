import {
  Box,
  Button,
  capitalize,
  Card,
  CardContent,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../layouts/Layout';
import { Store } from '../utils/Store';
import NextLink from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
  Add,
  ArrowForward,
  ArrowRight,
  ChevronRight,
  Discount,
  Remove,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import CartItem from '../components/CartItem';
import { ClassNames } from '@emotion/react';
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
    // const quantity = item.quantity - 1

    // dispatch({ type: 'REMOVE_FROM_CART', payload: item._id });

    dispatch({ type: 'DECREASE_ITEM_QUANTITY_TO_CART', payload: item._id });

    // setCart(prevCart => [...prevCart.filter((cartItem) => cartItem._id !== item._id), {...item, quantity}])
  };

  const increaseItemQuantityHandler = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item._id });

    // dispatch({ type: 'INCREASE_ITEM_QUANTITY_TO_CART', payload: item._id });
  };

  const subTotal = cart.reduce(
    (acc, next) => acc + next.quantity * parseInt(next.price),
    0
  );
  const shipping = 0;

  const taxes = 0;

  const discount = 0;

  const total = subTotal + shipping + taxes - discount;

  return (
    <Layout title="Shopping cart">
      {cartItemIds.length > 0 ? (
        <Grid container spacing={2} sx={{}}>
          <Grid item container xl={8} md={8} xs={12} spacing={2}>
            <List>
              {cart.map((cartItem) => (
                <ListItem key={cartItem._id}>
                  <Grid item xs={12} md={12} xl={12}>
                    <CartItem
                      product={cartItem}
                      decreaseItemQuantityHandler={decreaseItemQuantityHandler}
                      increaseItemQuantityHandler={increaseItemQuantityHandler}
                      removeFromCartHanler={removeFromCartHanler}
                    />
                  </Grid>
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item container xl={4} md={4} xs={12} spacing={2} sx={{}}>
            <List>
              <ListItem>
                <Grid item xl={12}>
                  <Card>
                    <CardContent>
                      <List>
                        <ListItem>
                          <Typography>
                            <Discount />
                            discount and discount
                          </Typography>
                        </ListItem>

                        <ListItem>
                          <TextField
                            placeholder="Code"
                            variant="filled"
                            fullWidth
                            label="Code"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </ListItem>

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
                            )}`}</Typography>
                          </Box>
                        </ListItem>

                        <ListItem>
                          <Box className={classes.flex} sx={{ flex: 1 }}>
                            <Typography>Shipping</Typography>
                            <div className={classes.grow}></div>
                            <Typography textAlign="right">{`${formatPriceToVND(
                              shipping
                            )}`}</Typography>
                          </Box>
                        </ListItem>

                        <ListItem>
                          <Box className={classes.flex} sx={{ flex: 1 }}>
                            <Typography>Taxes</Typography>
                            <div className={classes.grow}></div>
                            <Typography textAlign="right">{`${formatPriceToVND(
                              taxes
                            )}`}</Typography>
                          </Box>
                        </ListItem>

                        <ListItem>
                          <Box className={classes.flex} sx={{ flex: 1 }}>
                            <Typography>discount</Typography>
                            <div className={classes.grow}></div>
                            <Typography textAlign="right">{`${formatPriceToVND(
                              discount
                            )}`}</Typography>
                          </Box>
                        </ListItem>

                        <ListItem>
                          <Box className={classes.flex} sx={{ flex: 1 }}>
                            <Typography>Total</Typography>
                            <div className={classes.grow}></div>
                            <Typography textAlign="right">{`${formatPriceToVND(
                              total
                            )}`}</Typography>
                          </Box>
                        </ListItem>

                        <ListItem>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => router.push('/shipping')}
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
        <Typography>
          Cart is empty!
          <NextLink href="/" passHref>
            <Link>
              <Typography>Go shopping!</Typography>
            </Link>
          </NextLink>
        </Typography>
      )}
    </Layout>
  );
}
