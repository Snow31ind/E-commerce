import { Button, styled, Typography } from '@mui/material';
import React from 'react';

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'clicked',
})(({ theme, clicked }) => ({
  padding: 5,
  textTransform: 'none',
  backgroundColor: 'white',
  ...(clicked && {
    borderColor: theme.palette.secondary.main,
    borderWidth: 3,
  }),
  ...(!clicked && {
    borderColor: 'gray',
    borderWidth: 1,
  }),
}));

const StyledTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'clicked',
})(({ theme, clicked }) => ({
  fontSize: 14,
  ...(clicked && {
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
  }),
  ...(!clicked && {
    color: 'black',
  }),
}));

export default function ButtonComponentTag({
  tag,
  clicked,
  toggleFilterTagHandler,
  category,
}) {
  return (
    <StyledButton
      variant="outlined"
      // color={clicked ? 'secondary' : 'warning'}
      clicked={clicked}
      onClick={toggleFilterTagHandler}
      sx={{
        mr: 1,
        mb: 1,
      }}
    >
      {category === 'RAM' ? (
        <StyledTypography clicked={clicked}>{`${tag} GB`}</StyledTypography>
      ) : category === 'Weight' ? (
        <StyledTypography clicked={clicked}>{`${tag} kg`}</StyledTypography>
      ) : (
        <StyledTypography clicked={clicked}>{tag}</StyledTypography>
      )}
    </StyledButton>
  );
}
