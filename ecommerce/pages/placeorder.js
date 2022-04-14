import {
  Button,
  Card,
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
  CircularProgress,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../layouts/Layout';
import { Store } from '../utils/Store';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';
import CheckoutWizard from '../components/CheckoutWizard';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/errors';
import { useStyles } from '../utils/styles';
import NextLink from 'next/link';
import Image from 'next/image';

function PlaceOrder() {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const {
    user,
    cart: { shippingAddress, paymentMethod, cartItemIds },
  } = state;
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);

  const roundToTwo = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = cart.reduce((a, c) => a + c.quantity * c.price, 0);

  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = roundToTwo(itemsPrice * 0.15);
  const totalPrice = roundToTwo(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }

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

  const placeOrderHandler = async () => {
    closeSnackbar();

    const orderItems = cart.map((cartItem) => ({
      name: cartItem.name,
      quantity: cartItem.quantity,
      image: cartItem.images[0] || '',
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

      dispatch({ type: 'CART_CLEAR' });
      setLoading(false);

      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);

      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  };

  if (!cart) {
    return <div>Loading</div>;
  }

  return (
    <Layout title="Shopping Cart">
      <CheckoutWizard activeStepIndex={3} />

      <Typography componenet="h1" variant="h1">
        Place order
      </Typography>

      <Grid container spacing={1}>
        {/* Cart information */}
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

        {/* Cart actions */}
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
              <ListItem>
                {!loading ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </Button>
                ) : (
                  <ListItem>
                    <CircularProgress />
                  </ListItem>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

// Not fixed yet
export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
