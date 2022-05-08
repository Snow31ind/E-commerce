import { Box, Skeleton } from '@mui/material';
import React from 'react';

const LoadingCartItem = () => {
  return (
    <Box>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={100}
        sx={{ mb: 2 }}
      />
    </Box>
  );
};

export default LoadingCartItem;
