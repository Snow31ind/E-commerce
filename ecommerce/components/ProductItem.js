import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Divider,
  IconButton,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import NextLink from 'next/link';
import { getDiscountPercent, formatPriceToVND } from '../utils/helpers';
import icon from '../public/favicon.ico';
import NextImage from 'next/image';
import { Favorite, Redeem, Star } from '@mui/icons-material';
import { useStyles } from '../utils/styles';
export default function ProductItem({ product, addToCartHandler }) {
  // const idx = product.images.findIndex((image) => checkImageExistence(image));

  const classes = useStyles();
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

  return (
    <Card sx={{ height: '100%' }}>
      {/* <CardHeader> */}
      <CardContent
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <NextImage
          // component="img"
          src={`/brands/${product.brand}.png`}
          // image={`/brands/${product.brand}.png`}
          width={60}
          height={20}
        />

        <IconButton>
          <Favorite />
        </IconButton>
      </CardContent>

      {/* </CardHeader> */}
      <NextLink href={`/products/${product.slug}`} passHref>
        <CardActionArea
          sx={{
            justifyContent: 'center',
            display: 'flex',
            // bgcolor: 'gray',
          }}
        >
          {/* <CardMedia
            component={'img'}
            image={product.images[0]}
            title={product.name}
          /> */}

          <NextImage
            component="img"
            // image={product.images[0]}
            src={product.images[0]}
            width="170%"
            height="150%"
            layout="fixed"
            // layout="responsive"
            // image={product.images.find((image) => checkImageExistence(image))}
            // title={product.name}
          />
        </CardActionArea>
      </NextLink>

      <CardContent>
        <Typography className={classes.productName}>{product.name}</Typography>
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
        {/* <Rating value={product.rating} readOnly /> */}
        <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Box className={classes.tag}>{processor}</Box>
          <Box className={classes.tag}>{ram}</Box>
          {ssd && <Box className={classes.tag}>{ssd}</Box>}
          <Box className={classes.tag}>{graphicProcessor}</Box>
          <Box className={classes.tag}>{weight}</Box>
          <Box className={classes.tag}>{screen}</Box>
        </Box>

        <div className={classes.grow}></div>

        <Divider />

        <Box
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <Stack direction="row" alignItems="center">
            <Redeem fontSize="small" />
            <Typography className={classes.coupon}>
              Coupons {'&'} presents
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center">
            <Typography className={classes.coupon}>{product.rating}</Typography>
            <Star />
          </Stack>
        </Box>
      </CardContent>

      {/* <CardActions>
        <Button
          size="small"
          color="secondary"
          onClick={() => addToCartHandler(product)}
        >
          Add To Cart
        </Button>
      </CardActions> */}
    </Card>
  );
}
