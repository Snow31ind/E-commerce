import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import React from 'react';
import NextImage from 'next/image';
import {
  Add,
  CancelPresentation,
  HighlightOff,
  InfoOutlined,
  MonetizationOnOutlined,
  Remove,
} from '@mui/icons-material';
import { formatPriceToVND, getDiscountPercent } from '../../utils/helpers';
import { useStyles } from './styles';

const SquareIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 0,
  padding: 0,
}));

export default function CartItem({
  product,
  decreaseItemQuantityHandler,
  increaseItemQuantityHandler,
  removeFromCartHandler,
}) {
  const classes = useStyles();

  const image = product.images[0];

  const { name, price, oldPrice, countInStock, numReviews, quantity } = product;

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
      ? 'SSD '.concat(
          product.processorAndMemory.ssdCapacity.toString().concat(' GB')
        )
      : product.processorAndMemory.ssd;
  const battery =
    product.general.batteryBackup > 0
      ? product.general.batteryBackup.toString().concat(' hours')
      : 'Unknown';
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
    <Card sx={{ heigh: '100%' }}>
      <CardContent>
        <Stack direction="row">
          <Box className={classes.cartItemImage}>
            <NextImage src={image} width={120} height={80} />
          </Box>

          <Box
            sx={{
              alignContent: 'space-between',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography className={classes.cartItemName}>
              {product.name}
            </Typography>
            <Box className={classes.flex} sx={{ alignItems: 'flex-start' }}>
              <InfoOutlined color="disabled" />
              <Typography className={classes.cartItemDetail}>
                {processor}
                {` - `}
                {ram}
                {` - `}
                {ssd}
                {` - `}
                {graphicProcessor}
              </Typography>
            </Box>
            <Box className={classes.flex} sx={{ alignItems: 'flex-start' }}>
              <MonetizationOnOutlined color="disabled" />
              <Typography
                className={classes.cartItemPrice}
              >{`${formatPriceToVND(price)} VND`}</Typography>
              <Typography sx={{ ml: 5 }} className={classes.cartItemOldPrice}>
                {`${formatPriceToVND(oldPrice)} VND`}
              </Typography>
              <Typography sx={{ ml: 2 }} className={classes.cartItemDiscount}>
                {getDiscountPercent(oldPrice, price)}
                {'%'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Box
            className={classes.flex}
            sx={{
              flexDirection: 'column',
            }}
          >
            <SquareIconButton onClick={() => removeFromCartHandler(product)}>
              <CancelPresentation color="error" />
            </SquareIconButton>

            <Box className={classes.grow}></Box>

            <Box className={classes.flexBox}>
              <SquareIconButton
                disabled={quantity > 1 ? false : true}
                color={quantity > 1 ? 'error' : 'default'}
                onClick={() => decreaseItemQuantityHandler(product)}
              >
                <Remove />
              </SquareIconButton>
              <Typography>{product.quantity}</Typography>
              <SquareIconButton
                color="secondary"
                onClick={() => increaseItemQuantityHandler(product)}
              >
                <Add />
              </SquareIconButton>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
