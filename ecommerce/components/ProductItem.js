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
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Box className={classes.cardHeader}>
          <NextImage
            component="img"
            src={`/brands/${product.brand}.png`}
            width={60}
            height={20}
          />
          <IconButton>
            <Favorite />
          </IconButton>
        </Box>

        <NextLink href={`/products/${product.slug}`} passHref>
          <CardActionArea className={classes.cardImage}>
            <NextImage
              component="img"
              src={product.images[0]}
              width="170%"
              height="150%"
              layout="fixed"
            />
          </CardActionArea>
        </NextLink>

        <Box className={classes.cardBody}>
          <Box className={classes.cardInfo}>
            <Typography className={classes.productName}>
              {product.name}
            </Typography>
            <Typography className={classes.productPrice}>
              {formatPriceToVND(product.price)}
            </Typography>
            <Typography className={classes.productOldPrice}>
              {formatPriceToVND(product.oldPrice)}
              {`   `}
            </Typography>
            <Typography className={classes.productDiscount}>
              {`${getDiscountPercent(product.oldPrice, product.price)}%`}
            </Typography>
          </Box>

          {/* <Rating value={product.rating} readOnly /> */}
          <Box className={classes.tagBox}>
            <Box className={classes.tag}>{processor}</Box>
            <Box className={classes.tag}>{ram}</Box>
            {ssd && <Box className={classes.tag}>{ssd}</Box>}
            <Box className={classes.tag}>{graphicProcessor}</Box>
            <Box className={classes.tag}>{weight}</Box>
            <Box className={classes.tag}>{screen}</Box>
          </Box>

          <Box className={classes.cardBottom}>
            <Divider />
            <Box className={classes.cardBottomContent}>
              <Stack direction="row" alignItems="center">
                <Redeem fontSize="small" />
                <Typography className={classes.coupon}>
                  Coupons {'&'} presents
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                <Typography className={classes.coupon}>
                  {product.rating}
                </Typography>
                <Star />
              </Stack>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
