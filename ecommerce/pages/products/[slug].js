import React, { useContext, useRef } from 'react';
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
  Slide,
  Stack,
  Typography,
  useScrollTrigger,
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

function HideOnScroll(props) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

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

  const processor = product.processorAndMemoryFeatures.processorBrand
    .concat(' ')
    .concat(product.processorAndMemoryFeatures.processorName)
    .concat(' ')
    .concat(product.processorAndMemoryFeatures.processorVariant);
  const ram = product.processorAndMemoryFeatures.ram;
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
  const power = product.additionalFeatures.additionalFeatures
    ? product.additionalFeatures.additionalFeatures
    : product.general.powerSupply;
  const ports = product.portAndSlotFeatures.hdmiPort
    .concat(' ')
    .concat(product.portAndSlotFeatures.usbPort);

  const containerRef = useRef(null);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Layout title={product.name} description={`${product.name}`}>
      <Grid container spacing={5} ref={containerRef}>
        <Grid item container md={6} xs={12} spacing={5}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NextImage
                    component="img"
                    src={product.images[0]}
                    alt={product.name}
                    width="300%"
                    height="300%"
                    // sizes
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
                        <NextImage
                          src="/items/chip.png"
                          width={20}
                          height={20}
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
                        <NextImage
                          src="/items/ram.png"
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

                <Divider />

                <Stack direction="row">
                  <List>
                    <ListItem>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <NextImage
                          src="/items/monitor.png"
                          width={20}
                          height={20}
                        />
                        <Box
                          sx={{
                            alignItems: 'flex-start',
                            ml: 1,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography>Monitor</Typography>
                          <Typography>{screen}</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  </List>
                  <List>
                    <ListItem>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <NextImage
                          src="/items/ram.png"
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
                          <Typography>Graphic Processing Unit</Typography>
                          <Typography>{graphicProcessor}</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  </List>
                </Stack>

                <Divider />

                <Stack direction="row">
                  <List>
                    <ListItem>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <NextImage
                          src="/items/storage.png"
                          width={20}
                          height={20}
                        />
                        <Box
                          sx={{
                            alignItems: 'flex-start',
                            ml: 1,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography>Storage</Typography>
                          <Typography>{ssd}</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  </List>
                  <List>
                    <ListItem>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <NextImage
                          src="/items/battery.png"
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
                          <Typography>Battery</Typography>
                          <Typography>{power}</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  </List>
                </Stack>

                <Divider />

                <Stack direction="row">
                  <List>
                    <ListItem>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <NextImage
                          src="/items/port.png"
                          width={20}
                          height={20}
                        />
                        <Box
                          sx={{
                            alignItems: 'flex-start',
                            ml: 1,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography>Ports</Typography>
                          <Typography>{ports}</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  </List>
                </Stack>

                <Divider />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid item container md={6} xs={12}>
          <Grid item xs={12} position="fixed">
            <Card>
              <CardContent>
                <Typography className={classes.slug_productName}>
                  {product.name}
                </Typography>
                <Typography className={classes.slug_productPrice}>
                  {formatPriceToVND(product.price)}
                </Typography>
                <Typography
                  display="inline"
                  className={classes.slug_productOldPrice}
                >
                  {formatPriceToVND(product.oldPrice)}
                  {`   `}
                </Typography>
                <Typography
                  display="inline"
                  className={classes.slug_productDiscount}
                >
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
