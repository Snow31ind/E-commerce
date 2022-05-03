import { Search } from '@mui/icons-material';
import React from 'react';
import SearchBox from './SearchBox';
import SearchIconWrapper from './SearchIconWrapper';
import StyledInputBase from './StyledInputBase';

const SearchEngine = ({ open }) => {
  const submitHandler = () => {};

  const queryChangeHandler = () => {};
  return (
    <SearchBox>
      <form onSubmit={submitHandler}>
        <SearchIconWrapper>
          <Search type="submit" />
        </SearchIconWrapper>
        <StyledInputBase
          name="query"
          onChange={queryChangeHandler}
          placeholder="Search..."
        />
      </form>
    </SearchBox>
  );
};

export default SearchEngine;
