import { Chip } from '@mui/material';
import React from 'react';

export default function FilterChip(props) {
  const { category, tag, toggleTagFilterHandler } = props;
  const label =
    category === 'RAM'
      ? tag.toString().concat(' GB')
      : category === 'Weight'
      ? tag.toString().concat(' kg')
      : tag;
  return (
    <Chip
      color="secondary"
      variant="contained"
      label={label}
      onDelete={() => toggleTagFilterHandler(category, tag)}
      {...props}
    />
  );
}
