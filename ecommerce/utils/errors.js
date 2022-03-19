import React from 'react';

const getError = (err) =>
  err.response && err.response.data && err.response.message
    ? err.response.data.message
    : err.message;

export { getError };
