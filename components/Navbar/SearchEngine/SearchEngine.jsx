import { Search } from '@mui/icons-material';
import React, { useState } from 'react';
import SearchBox from './SearchBox';
import SearchIconWrapper from './SearchIconWrapper';
import StyledInputBase from './StyledInputBase';
import { useRouter } from 'next/router';

const SearchEngine = ({ open }) => {
  const router = useRouter();

  const [query, setQuery] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (query) {
      router.push(`/?query=${query}`);
    } else {
      router.push('/');
    }
  };

  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };

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
