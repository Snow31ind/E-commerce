import { IconButton, styled } from '@mui/material';
import React from 'react';

const SquareIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 10,
  borderWidth: 1,
  borderStyle: 'solid',
}));

export default SquareIconButton;
