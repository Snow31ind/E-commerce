import {
  AppBar,
  Avatar,
  Button,
  Container,
  createTheme,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  styled,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import React, { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useStyles } from '../utils/styles';
import {
  Favorite,
  List,
  LocalShipping,
  Person,
  Search,
  SearchOffRounded,
  ShoppingCart,
} from '@mui/icons-material';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Layout({ title, description, children, ...props }) {
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

  const loginMenuClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = () => {
    setAnchorEl(null);
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);

    dispatch({ type: 'USER_LOGOUT' });
    const msg = 'Logging out succesfully';
    enqueueSnackbar(msg, { variant: 'success' });
    router.push('/');
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title}` : 'TechNerds'}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>

      <ThemeProvider theme={theme}>
        <AppBar position="static" className={classes.navbar}>
          <Toolbar sx={{ pl: 50, pr: 50 }}>
            <NextLink href="/" passHref>
              <Link>
                <Typography color="black">TechNerds</Typography>
              </Link>
            </NextLink>

            {/* <div>
              <Button startIcon={<List />} variant="contained">
                <Typography>Category</Typography>
              </Button>
            </div> */}

            <div className={classes.grow}></div>

            <div>
              <IconButton>
                <Search />
              </IconButton>
              <IconButton>
                <ShoppingCart />
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
      </ThemeProvider>

      <DrawerHeader />
      <Container sx={{ ...props }}>{children}</Container>
    </div>
  );
}
