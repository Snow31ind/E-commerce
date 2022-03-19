import React, { useReducer } from 'react';
import Cookies from 'js-cookie';

const Store = React.createContext();

const initialState = {
  darkMode: false,
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'USER_LOGIN': {
      const user = action.payload;
      Cookies.set('user', JSON.stringify(user));

      return { ...state, user };
    }
    case 'USER_LOGOUT': {
      const user = null;

      Cookies.set('user', user);

      return { ...state, user };
    }
  }
}

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = {
    state,
    dispatch,
  };

  return <Store.Provider value={value}>{children}</Store.Provider>;
}

export { Store, StoreProvider };
