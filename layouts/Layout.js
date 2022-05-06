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
import {
  ADD_TO_FAV,
  DECREASE_ITEM_QUANTITY_TO_CART,
  LOGOUT,
  SIGNOUT,
} from '../constants/actionTypes';
import Navbar from '../components/Navbar/Navbar';

export default function Layout({
  title,
  description,
  children,
  isAtHomePage = false,
  ...props
}) {
  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>{title ? `${title}` : 'TechNerds'}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>

      <Navbar />

      {!isAtHomePage && <DrawerHeader />}
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
