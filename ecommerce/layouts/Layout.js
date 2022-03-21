import {
  alpha,
  AppBar,
  Avatar,
  Badge,
  Button,
  Collapse,
  Container,
  createTheme,
  IconButton,
  InputBase,
  Link,
  List,
  ListItem,
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
} from '@mui/material';
import Head from 'next/head';
import React, { useContext, useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useStyles } from '../utils/styles';
import {
  Close,
  ExitToAppOutlined,
  ExpandLess,
  ExpandMore,
  Favorite,
  Laptop,
  LocalShipping,
  Person,
  Search,
  ShoppingCart,
  ViewList,
} from '@mui/icons-material';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/system';
import axios from 'axios';
import NextImage from 'next/image';

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
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ExitIconWrapper = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  // position: 'relative',
  // pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'tomato',
  // display: 'none',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    // marginRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '50%',
    [theme.breakpoints.up('sm')]: {
      width: '15ch',
      '&:focus': {
        width: '45ch',
      },
    },
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Layout({ title, description, children, ...props }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [brands, setBrands] = useState([]);
  const [searching, setSearching] = useState(false);
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { user } = state;
  const router = useRouter();

  const theme = createTheme({
    palette: {
      secondary: {
        main: '#208080',
      },
    },
    typography: {},
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const [query, setQuery] = useState('');

  const loginMenuClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = (e, redirect) => {
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
    router.push('/login');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };

  const toggleDrawerHandler = (state) => {
    setOpenDrawer(state);
  };

  useEffect(() => {
    const fetchDistinctBrands = async () => {
      const { data } = await axios.get('/api/products/brands');

      setBrands(data);
    };

    fetchDistinctBrands();
  }, []);

  const [openLaptop, setOpenLaptop] = useState(true);

  const toggleMenuHandler = () => {
    setOpenLaptop(!openLaptop);
  };

  return (
    <div style={{ backgroundColor: 'rgba(236, 240, 244, 1)' }}>
      <Head>
        <title>{title ? `${title}` : 'TechNerds'}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>

      <ThemeProvider theme={theme}>
        <HideOnScroll>
          <AppBar className={classes.navbar}>
            <Toolbar sx={{ pl: 50, pr: 50 }}>
              <IconButton onClick={() => toggleDrawerHandler(true)}>
                <MenuIcon />
              </IconButton>

              <NextLink href="/" passHref>
                <Link>
                  <Typography className={classes.logoText}>
                    TechNerds
                  </Typography>
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

                <IconButton onClick={() => router.push('/cart')}>
                  {state.cart.cartItemIds.length > 0 ? (
                    <Badge
                      badgeContent={[...new Set(state.cart.cartItemIds)].length}
                      color="secondary"
                    >
                      <ShoppingCart />
                    </Badge>
                  ) : (
                    <ShoppingCart />
                  )}
                </IconButton>
                <IconButton>
                  <Favorite />
                </IconButton>
                <IconButton>
                  <LocalShipping />
                </IconButton>
                {user ? (
                  <>
                    <IconButton
                      aria-controls="avatar-menu"
                      aria-haspopup="true"
                      onClick={loginMenuClickHandler}
                    >
                      <Avatar>U</Avatar>
                    </IconButton>
                    <Menu
                      id="avatar-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={loginMenuCloseHandler}
                    >
                      <MenuItem
                        onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                      >
                        Profile
                      </MenuItem>
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, '/order-history')
                        }
                      >
                        Order history
                      </MenuItem>
                      {user.isAdmin && (
                        <MenuItem
                          onClick={(e) =>
                            loginMenuCloseHandler(e, '/admin/dashboard')
                          }
                        >
                          Admin Dashboard
                        </MenuItem>
                      )}
                      <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <NextLink href="/login" passHref>
                    <IconButton>
                      <Person />
                    </IconButton>
                  </NextLink>
                )}
              </div>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
      </ThemeProvider>

      {/* Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={openDrawer}
        onClose={() => toggleDrawerHandler(false)}
        onOpen={() => toggleDrawerHandler(true)}
      >
        <Box
          sx={{ width: 300 }}
          role="presentation"
          // onClick={() => toggleDrawerHandler(false)}
          onKeyDown={() => toggleDrawerHandler(false)}
        >
          {brands.length > 0 && (
            <List
              aria-labelledby="nested-list-subheader"
              subheader={<ListSubheader>Categories</ListSubheader>}
            >
              <ListItemButton onClick={toggleMenuHandler}>
                <ListItemIcon>
                  <Laptop />
                </ListItemIcon>
                <ListItemText primary="Laptop" />
                {openLaptop ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={openLaptop} timeout="auto">
                <List disablePadding component="div">
                  {brands.map((brand) => (
                    <NextLink
                      href={`/search?query=${brand}`}
                      passHref
                      key={brand}
                    >
                      <ListItemButton
                        onClick={() => toggleDrawerHandler(false)}
                      >
                        <ListItemAvatar>
                          <Avatar src={`/brands/${brand}.png`} />
                        </ListItemAvatar>
                        <ListItemText primary={brand}></ListItemText>
                      </ListItemButton>
                    </NextLink>
                  ))}
                </List>
              </Collapse>
            </List>
          )}
        </Box>
      </SwipeableDrawer>

      <DrawerHeader />
      <Container sx={{ ...props, minHeight: '100vh' }}>{children}</Container>
      <footer></footer>
    </div>
  );
}
