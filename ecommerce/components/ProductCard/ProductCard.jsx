import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Fade,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorderOutlined,
  ShoppingCartOutlined,
} from '@mui/icons-material';
import React, { useContext, useState } from 'react';
import NextLink from 'next/link';
import { getDiscountPercent, formatPriceToVND } from '../../utils/helpers';
import { useStyles } from './styles';
import NextImage from 'next/image';
import { Store } from '../../utils/Store';

const ProductCard = ({ product, saveItemHandler, addToCartHandler }) => {
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

  const {
    state: { favs },
  } = useContext(Store);

  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Box className={classes.cardHeader}>
          <NextImage
            src={`/brands/${product.brand.toLowerCase()}.png`}
            width={60}
            height={20}
          />
          <IconButton
            color="error"
            onClick={() => saveItemHandler(product._id)}
            sx={{
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'grey.400',
              },
            }}
          >
            {favs.includes(product._id) ? (
              <Favorite color="error" />
            ) : (
              <FavoriteBorderOutlined color="error" />
            )}
          </IconButton>
        </Box>

        <Box
          component="div"
          sx={{ display: 'flex', position: 'relative', mt: 1 }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Fade in={isHovering} unmountOnExit timeout={600}>
            <Box
              position="absolute"
              top={0}
              right={0}
              sx={{
                padding: 1,
                ...(isHovering && {
                  display: 'normal',
                  zIndex: 20,
                }),
                ...(!isHovering && {
                  display: 'none',
                }),
              }}
            >
              <IconButton
                color="error"
                onClick={() => addToCartHandler(product)}
                sx={{
                  borderRadius: 2,
                  ml: 1,
                  bgcolor: 'grey.200',
                  '&:hover': {
                    bgcolor: 'grey.400',
                  },
                }}
              >
                <ShoppingCartOutlined />
              </IconButton>
            </Box>
          </Fade>

          <Box sx={{ flex: 1 }}>
            <NextLink href={`/products/${product.slug}`} passHref>
              <CardActionArea className={classes.cardImage}>
                <NextImage src={product.images[0]} width="170%" height="150%" />
              </CardActionArea>
            </NextLink>
          </Box>
        </Box>

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
              {`  ${getDiscountPercent(product.oldPrice, product.price)}%`}{' '}
            </Typography>
          </Box>
          {/* <Rating value={product.rating} readOnly /> */}
          <Box className={classes.tagBox}>
            <Box className={classes.tag}> {processor} </Box>
            <Box className={classes.tag}> {graphicProcessor} </Box>
            <Box className={classes.tag}> {ram} </Box>
            {ssd && <Box className={classes.tag}> {ssd} </Box>}
            <Box className={classes.tag}> {weight} </Box>
            <Box className={classes.tag}> {screen} </Box>
          </Box>

          <Box className={classes.cardBottom}>
            <Divider />

            <Box className={classes.cardBottomContent}>
              {/* <Redeem fontSize="small" /> */}
              <Box className={classes.flexBox}>
                <NextImage
                  src="/items/present.png"
                  width={30}
                  height={30}
                  layout="fixed"
                />
                <Typography className={classes.coupon}>
                  Coupons {'&'}
                  presents
                </Typography>
              </Box>
              <Box className={classes.flexBox}>
                <Typography className={classes.coupon}>
                  {' '}
                  {product.rating}
                </Typography>
                {/* <Star /> */}
                <NextImage
                  src="/items/star.png"
                  width={30}
                  height={30}
                  layout="fixed"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
