import { Add, Remove } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React from 'react';
import SquareIconButton from '../components/SquareIconButton';
import NextImage from 'next/image';
import { formatPriceToVND } from '../utils/helpers';
import { useStyles } from '../utils/styles';

export default function MiniCartItem(props) {
  const { decreaseItemQuantityHandler, increaseItemQuantityHandler } = props;
  const { item } = props;
  const { _id, name, img, oldPrice, price, quantity } = item;
  const classes = useStyles();

  return (
    <Box sx={{ display: 'flex', flex: 1 }}>
      <Box>
        <NextImage src={img} width="100%" height="100%" layout="fixed" />
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 'bold', fontSize: 15 }}>
          {name}
        </Typography>
        <Typography sx={{ fontSize: 14 }}>{`${formatPriceToVND(
          price
        )} VND`}</Typography>
        <Typography
          sx={{ fontSize: 11, textDecoration: 'line-through' }}
        >{`${formatPriceToVND(oldPrice)} VND`}</Typography>
      </Box>

      <Box className={classes.grow}></Box>

      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <SquareIconButton
          disabled={quantity === 1}
          color={quantity > 1 ? 'error' : 'default'}
          size="small"
          onClick={() => decreaseItemQuantityHandler(item)}
        >
          <Remove />
        </SquareIconButton>
        <Typography marginLeft={1} marginRight={1}>
          {quantity}
        </Typography>
        <SquareIconButton
          color="secondary"
          size="small"
          onClick={() => increaseItemQuantityHandler(item)}
        >
          <Add />
        </SquareIconButton>
      </Box>
    </Box>
  );
}
