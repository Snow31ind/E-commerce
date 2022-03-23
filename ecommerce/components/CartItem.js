import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import React from 'react';
import { useStyles } from '../utils/styles';
import NextImage from 'next/image';
import {
  Add,
  HighlightOff,
  Info,
  InfoOutlined,
  MonetizationOn,
  MonetizationOnOutlined,
  Remove,
  Square,
} from '@mui/icons-material';
import { formatPriceToVND, getDiscountPercent } from '../utils/helpers';

const SquareIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 0,
  padding: 0,
}));

export default function CartItem(props) {
  const classes = useStyles();

  const { product } = props;
  const {
    decreaseItemQuantityHandler,
    increaseItemQuantityHandler,
    removeFromCartHanler,
  } = props;
  const image = product.images[0];

  const { name, price, oldPrice, countInStock, numReviews, quantity } = product;

  const processor = product.processorAndMemory.processorBrand
    .concat(' ')
    .concat(product.processorAndMemory.processorName)
    .concat(' ')
    .concat(product.processorAndMemory.processorVariant);

  const ram = product.processorAndMemory.ram;

  const ssd =
    product.processorAndMemory.ssd === 'Yes'
      ? 'SSD '.concat(product.processorAndMemory.ssdCapacity)
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
    <Card sx={{ heigh: '100%' }}>
      <CardContent>
        <Stack direction="row">
          <Box className={classes.cartItemImage} sx={{ flex: 2 }}>
            <NextImage src={image} width={120} height={80} />
          </Box>
          <Box sx={{ flex: 7 }}>
            <Typography className={classes.cartItemName}>
              {product.name}
            </Typography>
            <Box className={classes.flex} sx={{ alignItems: 'center' }}>
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
            <Box className={classes.flex} sx={{ alignItems: 'center' }}>
              <MonetizationOnOutlined color="disabled" />
              <Typography>{formatPriceToVND(price)}</Typography>
              <Typography sx={{ ml: 5 }}>
                {formatPriceToVND(oldPrice)}
              </Typography>
              <Typography sx={{ ml: 2 }}>
                {getDiscountPercent(oldPrice, price)}
                {'%'}
              </Typography>
            </Box>
          </Box>

          <Box
            className={classes.flex}
            sx={{ flexDirection: 'column', flex: 2 }}
          >
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

          <Box
            className={classes.flex}
            sx={{ flexDirection: 'column', alignItems: 'flex-end' }}
          >
            <Typography>{formatPriceToVND(price)}</Typography>
            <SquareIconButton onClick={() => removeFromCartHanler(product)}>
              <Typography>Remove</Typography>
              <HighlightOff />
            </SquareIconButton>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
