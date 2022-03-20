import {
  Button,
  capitalize,
  Card,
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
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../layouts/Layout';
import { Store } from '../utils/Store';
import NextLink from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Add, Remove } from '@mui/icons-material';
import { useRouter } from 'next/router';

export default function Cart() {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItemIds },
  } = state;
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [cart, setCart] = useState([]);

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

    dispatch({ type: 'DECREASE_ITEM_QUANTITY_TO_CART', payload: item._id });

    // setCart(prevCart => [...prevCart.filter((cartItem) => cartItem._id !== item._id), {...item, quantity}])
  };

  const increaseItemQuantityHandler = (item) => {
    dispatch({ type: 'INCREASE_ITEM_QUANTITY_TO_CART', payload: item._id });
  };

  return (
    <Layout title="Shopping cart">
      <Typography>Shopping cart</Typography>
      {cartItemIds.length > 0 ? (
        <Grid container>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell>Actions</TableCell>
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
                              width={40}
                              height={40}
                            />
                          </Link>
                        </NextLink>
                      </TableCell>

                      <TableCell>
                        <Typography>{item.name}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography>{item.category}</Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          flexDirection="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconButton
                            disabled={item.quantity < 2}
                            onClick={() => decreaseItemQuantityHandler(item)}
                          >
                            <Remove />
                          </IconButton>
                          <Typography>{item.quantity}</Typography>
                          <IconButton
                            onClick={() => increaseItemQuantityHandler(item)}
                          >
                            <Add />
                          </IconButton>
                        </Stack>
                      </TableCell>

                      <TableCell align="right">
                        <Typography>{item.price}</Typography>
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => removeFromCartHanler(item)}
                        >
                          REMOVE
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item md={3} xs={12}>
            Price section
            <Card>
              <List>
                <ListItem>
                  <Typography>
                    Subtotal:
                    {cart.reduce(
                      (acc, next) => acc + next.quantity * parseInt(next.price),
                      0
                    )}
                    {' VND'}
                  </Typography>
                </ListItem>

                <ListItem>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => router.push('/shipping')}
                  >
                    Checkout
                  </Button>
                </ListItem>
              </List>
            </Card>
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
