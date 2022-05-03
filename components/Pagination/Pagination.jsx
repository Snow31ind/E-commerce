import React from 'react';
import { Pagination as MuiPagination, PaginationItem } from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { PAGE } from '../../constants';

const Pagination = ({ pagesCount, page, filterSearch }) => {
  const pageChangeHandler = (e, newPage) => {
    const query = {
      key: PAGE,
      value: parseInt(newPage) > 1 ? newPage : '',
    };

    console.log(query);

    filterSearch(query);
  };

  return (
    <MuiPagination
      showFirstButton
      showLastButton
      shape="rounded"
      count={pagesCount}
      defaultPage={parseInt(page || '1')}
      onChange={pageChangeHandler}
      renderItem={(item) => (
        <PaginationItem
          components={{
            previous: ArrowLeft,
            next: ArrowRight,
          }}
          {...item}
        />
      )}
    />
  );
};

export default Pagination;
