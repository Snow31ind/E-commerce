import React, { useContext } from 'react';
import db from '../../utils/db';
import Product from '../../models/Product';
import Layout from '../../layouts/Layout';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import { Store } from '../../utils/Store';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import {
  capitalize,
  formatPriceToVND,
  getDiscountPercent,
} from '../../utils/helpers';
import NextImage from 'next/image';
import { useStyles } from '../../utils/styles';

export default function ProductScreen(props) {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const addToCartHandler = async () => {
    dispatch({ type: 'ADD_TO_CART', payload: product._id });

    const msg = `${capitalize(product.category)} ${product.name} added to cart`;
    enqueueSnackbar(msg, { variant: 'success' });
    closeSnackbar();
  };

  const { product } = props;
  const image = product.images[0];
  const { name, price, oldPrice, countInStock, numReviews } = product;

  const processor = product.processorAndMemoryFeatures.processorName
    .concat(' ')
    .concat(product.processorAndMemoryFeatures.processorVariant);
  const ram = 'RAM '.concat(product.processorAndMemoryFeatures.ram);
  const ssd =
    product.processorAndMemoryFeatures.ssd === 'Yes'
      ? 'SSD '.concat(product.processorAndMemoryFeatures.ssdCapacity)
      : null;
  const graphicProcessor = product.processorAndMemoryFeatures.graphicProcessor;
  const weight = product.dimensions.weight.toString().concat(' kg');
  const screen = product.displayAndAudioFeatures.screenSize
    .substring(
      product.displayAndAudioFeatures.screenSize.indexOf('(') + 1,
      product.displayAndAudioFeatures.screenSize.lastIndexOf(')')
    )
    .toLowerCase()
    .replace(' ', '')
    .replace('inch', '"');
  const power = product.general.powerSupply;
  const ports = product.portAndSlotFeatures.hdmiPort
    .concat(' ')
    .concat(product.portAndSlotFeatures.usbPort);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Layout title={product.name} description={`${product.name}`}>
      <Grid container columnSpacing={10}>
        <Grid container md={6} xs={12} spacing={5}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box>
                  <NextImage
                    component="img"
                    src={product.images[0]}
                    alt={product.name}
                    width="100%"
                    height="100%"
                    sizes
                    // sizes={'80wv'}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction="row">
                  <List>
                    <ListItem>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <img
                          src="/items/chip.png"
                          width={20}
                          height={20}
                          // sizes
                        />
                        <Box
                          sx={{
                            alignItems: 'flex-start',
                            ml: 1,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography>Central Processing Unit (CPU)</Typography>
                          <Typography>{processor}</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  </List>
                  <List>
                    <ListItem>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <img
                          src="/items/chip.png"
                          width={20}
                          height={20}
                          // sizes
                        />
                        <Box
                          sx={{
                            alignItems: 'flex-start',
                            ml: 1,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography>RAM</Typography>
                          <Typography>{ram}</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  </List>
                </Stack>
              </CardContent>
              <CardContent>
                <Typography>{ssd}</Typography>
                <Typography>{graphicProcessor}</Typography>
                <Typography>{weight}</Typography>
                <Typography>{screen}</Typography>
                <Typography>{power}</Typography>
                <Typography>{ports}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid item md={6} xs={12}>
          <Card>
            <CardContent>
              <Typography className={classes.slug_productName}>
                {product.name}
              </Typography>
              <Typography className={classes.productPrice}>
                {formatPriceToVND(product.price)}
              </Typography>
              <Typography display="inline" className={classes.productOldPrice}>
                {formatPriceToVND(product.oldPrice)}
                {`   `}
              </Typography>
              <Typography display="inline" className={classes.productDiscount}>
                {`${getDiscountPercent(product.oldPrice, product.price)}%`}
              </Typography>
            </CardContent>

            <CardActions>
              <Button
                onClick={addToCartHandler}
                variant="contained"
                fullWidth
                color="secondary"
              >
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
