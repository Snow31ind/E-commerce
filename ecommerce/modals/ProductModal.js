import {
  Box,
  List,
  ListItem,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  OutlinedInput,
  FormControl,
  FormHelperText,
  ListItemButton,
  Button,
  Container,
} from '@mui/material';
import React, { useContext, useEffect, useReducer } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useStyles } from '../utils/styles';
import { Controller, useForm } from 'react-hook-form';
import { formatPriceToVND } from '../utils/helpers';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
export default function ProductModal(props) {
  const {
    state: { user },
  } = useContext(Store);
  const { productId, setRefresh, closeModalHandler } = props;
  const classes = useStyles();
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${productId}`);
      setProduct(data);

      setValue('id', data._id);
      setValue('name', data.name);
      setValue('price', data.price);
      setValue('oldPrice', data.oldPrice);
      setValue('countInStock', data.countInStock);
    };

    try {
      setLoading(true);
      fetchProduct();
    } catch (e) {
      setLoading(false);
      console.log(e.message);
    }

    setLoading(false);
  }, []);

  const submitEditProductHandler = async ({
    name,
    price,
    oldPrice,
    countInStock,
  }) => {
    try {
      setLoading(true);
      await axios.post(
        `/api/admin/products/update/${productId}`,
        {
          name,
          price,
          oldPrice,
          countInStock,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );

      setRefresh((prev) => prev + 1);
      closeModalHandler();
    } catch (e) {
      setLoading(false);
      console.log(e.message);
    }
    setLoading(false);
  };

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 50,
        left: 'calc(50% - 300px)',
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        // height: '100vh',
        // bgcolor: 'tomato',
        width: '600px',
      }}
    >
      {loading ? (
        <Stack spacing={1}>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Stack>
      ) : (
        <form onSubmit={handleSubmit(submitEditProductHandler)}>
          <List>
            <ListItem sx={{ justifyContent: 'center' }}>
              <Typography variant="h6">Edit Product</Typography>
            </ListItem>
            <ListItem>
              <Controller
                name="id"
                control={control}
                render={({ field }) => (
                  <TextField
                    disabled
                    variant="outlined"
                    id="id"
                    fullWidth
                    label="Product id *"
                    inputProps={{ type: 'text' }}
                    {...field}
                  />
                )}
              ></Controller>
            </ListItem>

            <ListItem>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: true,
                  minLength: 1,
                }}
                render={({ field }) => (
                  <TextField
                    autoFocus
                    variant="outlined"
                    id="name"
                    fullWidth
                    label="Product name *"
                    inputProps={{ type: 'text' }}
                    error={Boolean(errors.name)}
                    helperText={
                      errors.name
                        ? errors.name.type === 'minLength'
                          ? 'Price is invalid'
                          : 'Price is required'
                        : ''
                    }
                    {...field}
                  />
                )}
              ></Controller>
            </ListItem>

            <ListItem>
              <Controller
                name="price"
                control={control}
                rules={{
                  required: true,
                  minLength: 1,
                }}
                render={({ field }) => {
                  // console.log(field);

                  return (
                    <TextField
                      autoFocus
                      fullWidth
                      id="price"
                      inputProps={{
                        type: 'number',
                      }}
                      error={Boolean(errors.price)}
                      helperText={
                        errors.price
                          ? errors.price.type === 'minLength'
                            ? 'Price is invalid'
                            : 'Price is required'
                          : ''
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">VND</InputAdornment>
                        ),
                      }}
                      {...field}
                    />
                  );
                }}
              ></Controller>
            </ListItem>

            <ListItem>
              <Controller
                name="oldPrice"
                control={control}
                rules={{
                  required: true,
                  minLength: 1,
                }}
                render={({ field }) => (
                  <TextField
                    autoFocus
                    variant="outlined"
                    id="oldPrice"
                    fullWidth
                    label="Previous price *"
                    inputProps={{ type: 'number' }}
                    error={Boolean(errors.oldPrice)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">VND</InputAdornment>
                      ),
                    }}
                    helperText={
                      errors.oldPrice
                        ? errors.oldPrice.type === 'minLength'
                          ? 'Price is invalid'
                          : 'Price is required'
                        : ''
                    }
                    {...field}
                  />
                )}
              ></Controller>
            </ListItem>

            <ListItem>
              <Controller
                name="countInStock"
                control={control}
                rules={{
                  required: true,
                  minLength: 1,
                }}
                render={({ field }) => (
                  <TextField
                    autoFocus
                    variant="outlined"
                    id="countInStock"
                    fullWidth
                    label="Count in stock *"
                    inputProps={{ type: 'number' }}
                    error={Boolean(errors.countInStock)}
                    helperText={
                      errors.countInStock
                        ? errors.countInStock.type === 'minLength'
                          ? 'Count in stock is invalid'
                          : 'Count in stock is required'
                        : ''
                    }
                    {...field}
                  />
                )}
              ></Controller>
            </ListItem>

            <ListItem sx={{ justifyContent: 'center' }}>
              <Button type="submit" variant="contained" color="warning">
                SAVE
              </Button>
            </ListItem>
          </List>
        </form>
      )}
    </Paper>
  );
}
