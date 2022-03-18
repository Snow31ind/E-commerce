import {
  AppBar,
  Button,
  Container,
  createTheme,
  IconButton,
  Link,
  styled,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import React from 'react';
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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Layout({ title, description, children, ...props }) {
  const classes = useStyles();

  const theme = createTheme({
    palette: {
      secondary: {
        main: '#208080',
      },
    },
    typography: {},
  });

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
              <NextLink href="/login" passHref>
                <IconButton>
                  <Person />
                </IconButton>
              </NextLink>
            </div>
          </Toolbar>
        </AppBar>
      </ThemeProvider>

      <DrawerHeader />
      <Container sx={{ ...props }}>{children}</Container>
    </div>
  );
}
