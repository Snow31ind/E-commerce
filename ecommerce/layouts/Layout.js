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
<<<<<<< HEAD
} from '@mui/material';
import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useStyles } from '../utils/styles';
=======
} from "@mui/material";
import Head from "next/head";
import React, { useContext, useState } from "react";
import NextLink from "next/link";
import { useStyles } from "../utils/styles";
>>>>>>> e891da10f4fba013a163b3c21460c9a05f69abf1
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
<<<<<<< HEAD
  ViewList,
} from '@mui/icons-material';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/system';
import axios from 'axios';
=======
} from "@mui/icons-material";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
>>>>>>> e891da10f4fba013a163b3c21460c9a05f69abf1

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

const SearchBox = styled("div")(({ theme, open }) => ({
  position: "relative",
  display: "inline-flex",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

<<<<<<< HEAD
const SearchIconWrapper = styled(IconButton)(({ theme }) => ({
=======
const SearchIconWrapper = styled("div")(({ theme }) => ({
>>>>>>> e891da10f4fba013a163b3c21460c9a05f69abf1
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ExitIconWrapper = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  // position: 'relative',
  // pointerEvents: 'none',
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "tomato",
  // display: 'none',
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    // marginRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "50%",
    [theme.breakpoints.up("sm")]: {
      width: "15ch",
      "&:focus": {
        width: "45ch",
      },
    },
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
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
        main: "#208080",
      },
    },
    typography: {},
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const [query, setQuery] = useState("");

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

    dispatch({ type: "USER_LOGOUT" });
    const msg = "Logging out succesfully";
    enqueueSnackbar(msg, { variant: "success" });
    router.push("/login");
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

  const openLaptopHandler = () => {
    setOpenLaptop(!openLaptop);
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title}` : "TechNerds"}</title>
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
                  <Typography color="black">TechNerds</Typography>
                </Link>
              </NextLink>
              <div className={classes.grow}></div>
              {/* <div className={classes.searchSection}>
                <form onSubmit={submitHandler} className={classes.searchForm}>
                  <InputBase
                    name="query"
                    className={classes.searchInput}
                    placeholder="Search products"
                    onChange={queryChangeHandler}
                  />
                  <IconButton
                    type="submit"
                    className={classes.iconButton}
                    aria-label="search"
                  >
                    <Search />
                  </IconButton>
                </form>
              </div> */}
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
<<<<<<< HEAD

                <IconButton onClick={() => router.push('/cart')}>
=======
                <IconButton onClick={() => router.push("/cart")}>
>>>>>>> e891da10f4fba013a163b3c21460c9a05f69abf1
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
                        onClick={(e) => loginMenuCloseHandler(e, "/profile")}
                      >
                        Profile
                      </MenuItem>
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, "/order-history")
                        }
                      >
                        Order history
                      </MenuItem>
                      {user.isAdmin && (
                        <MenuItem
                          onClick={(e) =>
                            loginMenuCloseHandler(e, "/admin/dashboard")
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
        // onOpen={() => toggleDrawerHandler(true)}
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
              <ListItemButton onClick={openLaptopHandler}>
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
                      <ListItemButton>
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
      <Container sx={{ ...props }}>{children}</Container>
    </div>
  );
}
