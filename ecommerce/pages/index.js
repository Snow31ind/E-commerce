import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import Layout from '../layouts/Layout';
import NextLink from 'next/link';
import { capitalize, slugify } from '../utils/helpers';
import db from '../utils/db';
import Product from '../models/Product';
import { useContext, useState } from 'react';
import { Store } from '../utils/Store';
import { useSnackbar } from 'notistack';
import ProductItem from '../components/ProductItem';

export default function Home(props) {
  const { products } = props;
  const { dispatch } = useContext(Store);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const addToCartHandler = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product._id });

    const msg = `${capitalize(product.category)} ${product.name} added to cart`;
    enqueueSnackbar(msg, { variant: 'success' });
    closeSnackbar();
  };

  return (
    <Layout display="flex">
      {/* Filter section */}
      {/* <Grid container>
        <Typography>Filter section</Typography>
      </Grid> */}

      {/* Display section */}
      <Grid container spacing={1}>
        {products.map((product) => (
          <Grid item xs={6} md={4} xl={3} key={product.name}>
            <ProductItem
              product={product}
              addToCartHandler={addToCartHandler}
            />
            {/* <Card sx={{ minHeight: 400 }}>
              <NextLink href={`/products/${slugify(product.name)}`} passHref>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    image={product.images[0]}
                    alt={product.name}
                  />
                </CardActionArea>
              </NextLink>

              <CardContent>
                <Typography>{product.name}</Typography>
                <Typography>{product.oldPrice}</Typography>
                <Typography>{product.price}</Typography>
              </CardContent>

              <CardActions>
                <Button
                  variant="contained"
                  onClick={() => addToCartHandler(product)}
                  fullWidth
                >
                  Add to cart
                </Button>
              </CardActions>
            </Card> */}
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();

  return {
    props: {
      products: products.map(db.convertMongoDocToObject),
    },
  };
}
