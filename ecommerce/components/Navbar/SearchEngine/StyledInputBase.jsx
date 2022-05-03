import { InputBase, styled } from '@mui/material';
import React from 'react';

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    marginRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '15ch',
      '&:focus': {
        width: '45ch',
      },
    },
  },
}));

export default StyledInputBase;
