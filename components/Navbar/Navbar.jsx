import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  styled,
  Toolbar,
} from '@mui/material';
import React, { useState } from 'react';
import HideOnScroll from './HideOnScroll';
import NextLink from 'next/link';
import NextImage from 'next/image';
import SearchEngine from './SearchEngine/SearchEngine';
import { useStyles } from './styles';
import StyledIconButton from '../StyledIconButton';
import {
  Favorite,
  HistoryOutlined,
  Logout,
  Person,
  ShoppingCart,
  SupervisedUserCircleOutlined,
} from '@mui/icons-material';
import { useContext } from 'react';
import { Store } from '../../utils/Store';
import StyledBadge from '../StyledBadge';
import LoginModal from '../../modals/LoginModal';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { SIGNOUT } from '../../constants/actionTypes';

const Navbar = ({ isAtHomePage }) => {
  const classes = useStyles();

  const {
    state: { favs },
    cartState: { items },
    userState: { user },
    userDispatch,
  } = useContext(Store);

  const router = useRouter();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const [anchorEl, setAnchorEl] = useState(null);

  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignUpModal, setOpenSignUpLoginModal] = useState(false);

  const viewCartHandler = () => {
    router.push('/cart');
  };

  const closeLoginModalHandler = () => {
    setOpenLoginModal(false);
  };

  const loginMenuClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const closeSignUpModalHander = () => {
    setOpenSignUpLoginModal(false);
  };

  const openLoginModalHandler = () => {
    closeSignUpModalHander();

    setOpenLoginModal(true);
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
    // dispatch({ type: LOGOUT });
    userDispatch({ type: SIGNOUT });

    const msg = 'Logging out succesfully';
    enqueueSnackbar(msg, { variant: 'success' });
    router.push('/');
  };

  return (
    <React.Fragment>
      <HideOnScroll>
        <AppBar
          sx={{
            ...(isAtHomePage && {
              background: 'transparent',
              boxShadow: 'none',
            }),
          }}
        >
          <Toolbar
            sx={{
              backgroundColor: 'transparent',
              color: 'transparent',
            }}
          >
            <NextLink href="/" passHref>
              <Link>
                <NextImage
                  src={'/logos/logo2.png'}
                  width="110%"
                  height="60%"
                  layout="fixed"
                />
              </Link>
            </NextLink>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <SearchEngine />
              {/* Shopping cart icon */}
              <StyledIconButton onClick={viewCartHandler}>
                <Badge
                  badgeContent={items.length ? items.length : 0}
                  color="secondary"
                >
                  <ShoppingCart />
                </Badge>
              </StyledIconButton>

              {/* Favorite icon */}
              <StyledIconButton>
                <Badge
                  badgeContent={favs.length ? favs.length : 0}
                  color="secondary"
                >
                  <Favorite />
                </Badge>
              </StyledIconButton>
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
                <StyledIconButton onClick={openLoginModalHandler}>
                  <Person />
                </StyledIconButton>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <LoginModal
        open={openLoginModal}
        closeLoginModalHandler={closeLoginModalHandler}
      />
    </React.Fragment>
  );
};

export default Navbar;
