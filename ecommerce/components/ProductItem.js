import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import NextLink from 'next/link';
import { getDiscountPercent, formatPriceToVND } from '../utils/helpers';
import { Favorite, Redeem, Star } from '@mui/icons-material';
import { useStyles } from '../utils/styles';
import NextImage from 'next/image';

export default function ProductItem({ product, addToCartHandler }) {
  // const idx = product.images.findIndex((image) => checkImageExistence(image));

  const classes = useStyles();

  const processor = product.processorAndMemory.processorName
    .concat(' ')
    .concat(product.processorAndMemory.processorVariant);

  const ram = 'RAM '.concat(product.processorAndMemory.ram).concat(' GB');

  const ssd =
    product.processorAndMemory.ssd === 'Available'
      ? 'SSD '.concat(product.processorAndMemory.ssdCapacity).concat(' GB')
      : null;

  const graphicProcessor = product.processorAndMemory.graphicProcessor;

  const weight = product.dimensions.weight.toString().concat(' kg');

  const screen = product.displayAndAudio.screenSize
    .substring(
      product.displayAndAudio.screenSize.indexOf('(') + 1,
      product.displayAndAudio.screenSize.lastIndexOf(')')
    )
    .toLowerCase()
    .replace(' ', '')
    .replace('inch', '"');

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Box className={classes.cardHeader}>
          <NextImage
            // component="img"
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
              src={product.images[0]}
              width="170%"
              height="150%"
              // layout="fixed"
            />
          </CardActionArea>
        </NextLink>
        <Box className={classes.cardBody}>
          <Box className={classes.cardInfo}>
            <Typography className={classes.productName}>
              {' '}
              {product.name}{' '}
            </Typography>{' '}
            <Typography className={classes.productPrice}>
              {' '}
              {formatPriceToVND(product.price)}
            </Typography>
            <Typography className={classes.productOldPrice}>
              {' '}
              {formatPriceToVND(product.oldPrice)} {`   `}{' '}
            </Typography>
            <Typography className={classes.productDiscount}>
              {' '}
              {`${getDiscountPercent(product.oldPrice, product.price)}%`}{' '}
            </Typography>
          </Box>
          {/* <Rating value={product.rating} readOnly /> */}
          <Box className={classes.tagBox}>
            <Box className={classes.tag}> {processor} </Box>
            <Box className={classes.tag}> {ram} </Box>
            {ssd && <Box className={classes.tag}> {ssd} </Box>}
            <Box className={classes.tag}> {graphicProcessor} </Box>
            <Box className={classes.tag}> {weight} </Box>
            <Box className={classes.tag}> {screen} </Box>
          </Box>
          <Box className={classes.cardBottom}>
            <Divider />
            <Box className={classes.cardBottomContent}>
              <Stack direction="row" alignItems="center">
                <Redeem fontSize="small" />
                <Typography className={classes.coupon}>
                  Coupons {'&'}
                  presents
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                <Typography className={classes.coupon}>
                  {' '}
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
