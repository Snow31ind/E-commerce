import { AppBar, Link, Toolbar } from '@mui/material';
import React from 'react';
import HideOnScroll from './HideOnScroll';
import NextLink from 'next/link';
import NextImage from 'next/image';
import SearchEngine from './SearchEngine/SearchEngine';

const Navbar = ({ isAtHomePage }) => {
  return (
    <HideOnScroll>
      <AppBar>
        <Toolbar>
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

          <SearchEngine />
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
