import React, { useContext, useRef } from 'react';
import db from '../../utils/db';
import Product from '../../models/Product';
import Layout from '../../layouts/Layout';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { Store } from '../../utils/Store';
import { useSnackbar } from 'notistack';
import {
  capitalize,
  formatPriceToVND,
  getDiscountPercent,
} from '../../utils/helpers';
import NextImage from 'next/image';
import { useStyles } from '../../utils/styles';
import NextLink from 'next/link';
import { Devices, Home, Laptop, NavigateNext } from '@mui/icons-material';

export default function ProductScreen(props) {
  const classes = useStyles();
  const { dispatch } = useContext(Store);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const addToCartHandler = async () => {
    dispatch({ type: 'ADD_TO_CART', payload: product._id });

    const msg = `${capitalize(product.category)} ${product.name} added to cart`;
    enqueueSnackbar(msg, { variant: 'success' });
    closeSnackbar();
  };

  const { product } = props;
  // const image = product.images[0];
  // const { name, price, oldPrice, countInStock, numReviews } = product;

  const processor = product.processorAndMemory.processorName
    .concat(' ')
    .concat(product.processorAndMemory.processorVariant);
  const ram = 'RAM '.concat(product.processorAndMemory.ram).concat(' GB');
  // const ssd =
  //   product.processorAndMemory.ssd === 'Yes'
  //     ? 'SSD '.concat(product.processorAndMemory.ssdCapacity)
  //     : null;
  const ssd =
    product.processorAndMemory.ssd === 'Available'
      ? product.processorAndMemory.ssdCapacity.toString().concat(' GB')
      : product.processorAndMemory.ssd;
  const battery =
    product.general.batteryBackup > 0
      ? product.general.batteryBackup.toString().concat(' hours')
      : 'Unknown';
  const graphicProcessor = product.processorAndMemory.graphicProcessor;
  // const weight = product.dimensions.weight.toString().concat(' kg');
  const screen = product.displayAndAudio.screenSize
    .substring(
      product.displayAndAudio.screenSize.indexOf('(') + 1,
      product.displayAndAudio.screenSize.lastIndexOf(')')
    )
    .toLowerCase()
    .replace(' ', '')
    .replace('inch', '"');

  const ports = product.portAndSlot.hdmiPort
    .concat(' ')
    .concat(product.portAndSlot.usbPort);

  const containerRef = useRef(null);

  if (!product) {
    return <div>Product not found</div>;
  }

  const properties = [
    [
      {
        icon: '/items/chip.png',
        label: 'Central Processing Unit (CPU)',
        value: processor,
      },
      {
        icon: '/items/ram.png',
        label: 'Random Access Memory (RAM)',
        value: ram,
      },
    ],
    [
      {
        icon: '/items/monitor.png',
        label: 'Monitor Size',
        value: screen,
      },
      {
        icon: '/items/gpu.png',
        label: 'Graphic Processing Unit (GPU)',
        value: graphicProcessor,
      },
    ],
    [
      {
        icon: '/items/storage.png',
        label: 'SSD Storage Capacity',
        value: ssd,
      },
      {
        icon: '/items/battery.png',
        label: 'Battery',
        value: battery,
      },
    ],
    [
      {
        icon: '/items/port.png',
        label: 'Ports',
        value: ports,
      },
    ],
  ];

  return (
    <Layout title={product.name} description={`${product.name}`}>
      <Grid container spacing={5} ref={containerRef}>
        {/* Breadcrums */}
        <Grid item xs={12}>
          <Box>
            <Breadcrumbs separator={<NavigateNext />}>
              <NextLink href="/" passHref>
                <Link
                  underline="hover"
                  color="inherit"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Home sx={{ mr: 0.5 }} />
                  Homepage
                </Link>
              </NextLink>
              <NextLink href="/" passHref>
                <Link
                  underline="hover"
                  color="inherit"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Devices sx={{ mr: 0.5 }} />
                  Laptop
                </Link>
              </NextLink>
              <NextLink href={`/products/${product.slug}`} passHref>
                <Link
                  underline="hover"
                  color="inherit"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'black',
                  }}
                >
                  <Laptop sx={{ mr: 0.5 }} color="inherit" />
                  <Typography color="text.primary" fontWeight="bold">
                    {product.name}
                  </Typography>
                </Link>
              </NextLink>
            </Breadcrumbs>
          </Box>
        </Grid>

        {/* Product Information Display */}
        <Grid item container md={6} xs={12} spacing={5}>
          <Grid item xs={12}>
            <Card className={classes.slugCard}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NextImage
                    component="img"
                    src={product.images[0]}
                    alt={product.name}
                    width="300%"
                    height="300%"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card className={classes.slugCard}>
              <CardContent>
                {properties.map((property, index) => (
                  <>
                    <Stack key={index} direction="row">
                      {property.map((e) => (
                        <Box key={e.label} className={classes.property}>
                          <NextImage src={e.icon} width={20} height={20} />
                          <Box className={classes.propertyText}>
                            <Typography className={classes.propertyLabel}>
                              {e.label}
                            </Typography>
                            <Typography>{e.value}</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                    {index < properties.length - 1 && <Divider />}
                  </>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid item container md={6} xs={12}>
          <Grid item xs={12}>
            <Card
              className={classes.slugCard}
              sx={{ position: 'sticky', top: 10 }}
            >
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
