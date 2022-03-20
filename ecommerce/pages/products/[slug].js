import React, { useContext } from 'react';
import db from '../../utils/db';
import Product from '../../models/Product';
import Layout from '../../layouts/Layout';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { Store } from '../../utils/Store';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { capitalize } from '../../utils/helpers';

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const addToCartHandler = async () => {
    dispatch({ type: 'ADD_TO_CART', payload: product._id });

    const msg = `${capitalize(product.category)} ${product.name} added to cart`;
    enqueueSnackbar(msg, { variant: 'success' });
    closeSnackbar();
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Layout title={product.name} description={`${product.name}`}>
      <Grid container spacing={2}>
        <Grid item md={3} xs={12}>
          <Card>
            <CardMedia
              component="img"
              src={product.images[0]}
              alt={product.name}
            />
          </Card>
        </Grid>

        <Grid item md={9} xs={12}>
          <Card>
            <CardContent>
              <Typography>{product.name}</Typography>
              <Typography>{product._id}</Typography>
              <Typography>{product.oldPrice}</Typography>
              <Typography>{product.price}</Typography>
              <Typography>{product.countInStock}</Typography>
              <Typography>{product.numReviews}</Typography>
            </CardContent>

            <CardActions>
              <Button onClick={addToCartHandler} variant="contained" fullWidth>
                ADD TO CART
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  // console.log(`Context - ${context}`);
  const { params } = context;
  // console.log(`params - ${params}`);
  const { slug } = params;
  // console.log(`slug - ${slug}`);

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  // console.log(product);

  return {
    props: {
      product: db.convertMongoDocToObject(product),
    },
  };
}
