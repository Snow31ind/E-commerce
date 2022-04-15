import {
  AppBar,
  Avatar,
  Badge,
  Collapse,
  createTheme,
  IconButton,
  InputBase,
  Link,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Slide,
  styled,
  SwipeableDrawer,
  ThemeProvider,
  Toolbar,
  Typography,
  useScrollTrigger,
  alpha,
  ListItem,
  Popover,
  Fade,
  Grow,
  Box,
} from '@mui/material';
import Head from 'next/head';
import React, { useContext, useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useStyles } from '../utils/styles';
import {
  ExpandLess,
  ExpandMore,
  HistoryOutlined,
  Laptop,
  Person,
  Search,
  ShoppingCart,
  SupervisedUserCircleOutlined,
  Logout,
  PlayLessonOutlined,
  Favorite,
} from '@mui/icons-material';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { palette } from '@mui/system';
import axios from 'axios';
import StyledIconButton from '../components/StyledIconButton';
import StyledBadge from '../components/StyledBadge';
import NextImage from 'next/image';
import DrawerHeader from '../components/DrawerHeader';
import LoginModal from '../modals/LoginModal';
import SignUpModal from '../modals/SignUpModal';
import MiniCartItem from '../components/MiniCartItem';

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

const SearchBox = styled('div')(({ theme, open }) => ({
  position: 'relative',
  display: 'inline-flex',
  backgroundColor: theme.palette.grey[300],
  borderRadius: 20,
  // backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    // backgroundColor: alpha(theme.palette.action.active, 0.25),
    borderWidth: 3,
    borderColor: theme.palette.secondary.main,
    borderStyle: 'solid',
  },
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(2),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    marginRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '15ch',
      '&:focus': {
        width: '45ch',
      },
    },
  },
}));

export default function Layout({
  title,
  description,
  children,
  isAtHomePage = false,
  ...props
}) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [brands, setBrands] = useState([]);
  const [searching, setSearching] = useState(false);
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItemIds },
  } = state;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { user } = state;
  const router = useRouter();
  const theme = createTheme({
    // palette: {
    //   primary: {
    //     main: '#FFFFFF',
    //     ...palette.primary,
    //   },
    // },
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState('');
  const [openLaptop, setOpenLaptop] = useState(true);

  const [miniCart, setMiniCart] = useState([]);

  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignUpModal, setOpenSignUpLoginModal] = useState(false);

  const closeLoginModalHandler = () => {
    setOpenLoginModal(false);
  };

  const openLoginModalHandler = () => {
    closeSignUpModalHander();

    setOpenLoginModal(true);
  };

  const openSignUpModalHandler = () => {
    closeLoginModalHandler();

    setOpenSignUpLoginModal(true);
  };
  const closeSignUpModalHander = () => {
    setOpenSignUpLoginModal(false);
  };

  const decreaseItemQuantityHandler = (item) => {
    // const quantity = item.quantity - 1

    // dispatch({ type: 'REMOVE_FROM_CART', payload: item._id });

    dispatch({ type: 'DECREASE_ITEM_QUANTITY_TO_CART', payload: item._id });

    // setCart(prevCart => [...prevCart.filter((cartItem) => cartItem._id !== item._id), {...item, quantity}])
  };

  const increaseItemQuantityHandler = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item._id });

    // dispatch({ type: 'INCREASE_ITEM_QUANTITY_TO_CART', payload: item._id });
  };

  useEffect(() => {
    const fetchMiniCartItems = async () => {
      var lst = [];

      for (var cartItemId of cartItemIds) {
        console.log(`cartItemId - ${cartItemId}`);
        const { data } = await axios.get(`/api/products/${cartItemId}`);
        // console.log(data);
        const product = data;
        // console.log(`Product - ${product}`);

        const existItemIndex = lst.findIndex(
          (item) => item._id === product._id
        );
        // console.log(`existItemIndex = ${existItemIndex}`);
        const quantity =
          existItemIndex > -1 ? lst[existItemIndex].quantity + 1 : 1;

        const newMiniCartItem = {
          img: product.images[0],
          _id: product._id,
          name: product.name,
          price: product.price,
          oldPrice: product.oldPrice,
          quantity: quantity,
        };

        if (quantity > 1) {
          lst = lst
            .slice(0, existItemIndex)
            .concat(newMiniCartItem)
            .concat(lst.slice(existItemIndex + 1, lst.length));
        } else {
          lst.push(newMiniCartItem);
        }
      }

      setMiniCart(lst);
    };

    fetchMiniCartItems();
  }, [cartItemIds]);

  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const openCart = Boolean(cartAnchorEl);

  const openCartHandler = (e) => {
    setCartAnchorEl(e.currentTarget);
  };

  const closeCartHandler = () => {
    setCartAnchorEl(null);
  };

  const loginMenuClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = (e, redirect) => {
    e.preventDefault();
    setAnchorEl(null);

    if (redirect) {
      router.push(redirect);
    }
  };

  const logoutClickHandler = () => {
    closeSnackbar();
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });

    const msg = 'Logging out succesfully';
    enqueueSnackbar(msg, { variant: 'success' });
    router.push('/');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (query) {
      router.push(`/?query=${query}`);
    } else {
      router.push('/');
    }
  };

  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };

  const toggleDrawerHandler = (state) => {
    setOpenDrawer(state);
  };

  // useEffect(() => {
  //   const fetchDistinctBrands = async () => {
  //     const { data } = await axios.get('/api/products/brands');

  //     setBrands(data);
  //   };

  //   fetchDistinctBrands();
  // }, []);

  // useEffect(() => {
  //   const fetchMiniCartItems = async () => {
  //     const { data } = await axios.get('')
  //   };
  // }, [cartItemIds]);

  const toggleMenuHandler = () => {
    setOpenLaptop(!openLaptop);
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title}` : 'TechNerds'}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>

      {/* Appbar */}
      <ThemeProvider theme={theme}>
        <HideOnScroll>
          <AppBar
            className={classes.navbar}
            sx={{
              ...(isAtHomePage && {
                background: 'transparent',
                boxShadow: 'none',
              }),
              // background: 'transparent',
              // boxShadow: 'none',
            }}
          >
            <Toolbar
              className={classes.appBar}
              variant="dense"
              // color="transparent"
              sx={{ backgroundColor: 'transparent', color: 'transparent' }}
            >
              {/* <IconButton onClick={() => toggleDrawerHandler(true)}>
                <MenuIcon />
              </IconButton> */}
              <NextLink href="/" passHref>
                <Link>
                  <NextImage
                    src="/logos/logo2.png"
                    width="110%"
                    height="60%"
                    layout="fixed"
                    priority
                  ></NextImage>
                </Link>
              </NextLink>
              <div className={classes.grow}></div>

              <div>
                <SearchBox open={searching}>
                  <form onSubmit={submitHandler}>
                    <SearchIconWrapper>
                      <Search type="submit" aria-label="search" />
                    </SearchIconWrapper>
                    <StyledInputBase
                      name="query"
                      onChange={queryChangeHandler}
                      placeholder="Search"
                    />
                  </form>
                </SearchBox>
                {/* <NextLink href="/cart" passHref> */}
                <StyledIconButton onClick={openCartHandler}>
                  {state.cart.cartItemIds.length > 0 ? (
                    <Badge
                      badgeContent={state.cart.cartItemIds.length}
                      color="secondary"
                    >
                      <ShoppingCart />
                    </Badge>
                  ) : (
                    <ShoppingCart />
                  )}
                </StyledIconButton>
                {/* </NextLink> */}

                <StyledIconButton>
                  {state.favs.length > 0 ? (
                    <Badge
                      // badgeContent={[...new Set(state.cart.cartItemIds)].length}
                      badgeContent={state.favs.length}
                      color="secondary"
                    >
                      <Favorite />
                    </Badge>
                  ) : (
                    <Favorite />
                  )}
                </StyledIconButton>
                {/* 
                <IconButton>
                  <LocalShipping />
                </IconButton> */}
                {user ? (
                  <>
                    <StyledIconButton
                      aria-controls="avatar-menu"
                      aria-haspopup="true"
                      onClick={loginMenuClickHandler}
                    >
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        variant="dot"
                      >
                        <Avatar sx={{ width: 36, height: 36 }}>U</Avatar>
                      </StyledBadge>
                    </StyledIconButton>

                    <Menu
                      keepMounted
                      id="avatar-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, '/order-history')
                        }
                      >
                        <ListItemIcon>
                          <HistoryOutlined />
                        </ListItemIcon>
                        Order history
                      </MenuItem>
                      {user.isAdmin && (
                        <MenuItem
                          onClick={(e) =>
                            loginMenuCloseHandler(e, '/admin/dashboard')
                          }
                        >
                          <ListItemIcon>
                            <SupervisedUserCircleOutlined />
                          </ListItemIcon>
                          Admin Dashboard
                        </MenuItem>
                      )}
                      <MenuItem onClick={logoutClickHandler}>
                        <ListItemIcon>
                          <Logout />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  // <NextLink href="/login" passHref>
                  <StyledIconButton onClick={openLoginModalHandler}>
                    <Person />
                  </StyledIconButton>
                  // </NextLink>
                )}
              </div>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
      </ThemeProvider>

      {/* Mini cart */}
      <Popover
        open={openCart}
        onClose={closeCartHandler}
        anchorEl={cartAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Slide in={openCart} unmountOnExit timeout={300}>
          <Box sx={{ width: 500 }}>
            {cartItemIds.length > 0 ? (
              <List>
                {miniCart.map((miniCartItem) => (
                  <ListItem key={miniCartItem._id}>
                    <MiniCartItem
                      item={miniCartItem}
                      decreaseItemQuantityHandler={decreaseItemQuantityHandler}
                      increaseItemQuantityHandler={increaseItemQuantityHandler}
                    />
                  </ListItem>
                ))}
                <ListItem>
                  <Box sx={{ flex: 1, display: 'flex' }}>
                    <NextLink href="/cart" passHref>
                      <Link underline="hover">
                        <Typography>
                          {' '}
                          View all {`(${cartItemIds.length})`} items{' '}
                        </Typography>
                      </Link>
                    </NextLink>

                    <Box className={classes.grow} />

                    <NextLink href="/checkout" passHref>
                      <Link underline="hover">
                        <Typography>Checkout</Typography>
                      </Link>
                    </NextLink>
                  </Box>
                </ListItem>
              </List>
            ) : (
              <List>
                <ListItem>
                  <ListItemText
                    primary="Your cart is empty"
                    sx={{ textAlign: 'center' }}
                  />
                </ListItem>
              </List>
            )}
          </Box>
        </Slide>
      </Popover>

      {!isAtHomePage && <DrawerHeader />}
      <LoginModal
        open={openLoginModal}
        closeLoginModalHandler={closeLoginModalHandler}
      />
      {/* Main content <conta></conta>iner */}
      <Box
        className={!isAtHomePage && classes.main}
        sx={{
          minHeight: '100vh',
          ...props,
        }}
      >
        {children}
      </Box>

      <footer></footer>
    </div>
  );
}
