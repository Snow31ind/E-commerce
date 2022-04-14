import React from 'react';
import { styled, IconButton, alpha } from '@mui/material';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginLeft: 10,
  color: 'black',
  // backgroundColor: theme.palette.grey.A100,
  '&:hover': {
    backgroundColor: theme.palette.grey[400],
  },
}));

export default StyledIconButton;
