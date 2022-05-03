import { styled } from '@mui/material';
import React from 'react';

const SearchBox = styled('div')(({ theme }) => ({
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

export default SearchBox;
