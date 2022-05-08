import { Box, Skeleton } from '@mui/material';
import React from 'react';

const LoadingCartPayment = () => {
  return (
    <Box>
      <Skeleton variant="rectangular" width="100%" height={100} />
    </Box>
  );
};

export default LoadingCartPayment;
