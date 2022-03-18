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
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../layouts/Layout';
import styles from '../styles/Home.module.css';
import { data } from '../utils/data';
import NextLink from 'next/link';
import { slugify } from '../utils/helpers';
import db from '../utils/db';
import Product from '../models/Product';

export default function Home(props) {
  // const { products } = data;
  const { products } = props;

  return (
    <Layout display="flex">
      <Typography>Products</Typography>

      {/* Filter section */}
      <Grid container md={3}>
        <Typography>Filter section</Typography>
      </Grid>

      {/* Display section */}
      <Grid container spacing={1} md={9}>
        {products.map((product) => (
          <Grid item xs={6} md={4} xl={3} key={product.name}>
            <Card sx={{ minHeight: 400 }}>
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
                <Button variant="contained">Add to cart</Button>
              </CardActions>
            </Card>
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
