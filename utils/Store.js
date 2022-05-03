import React, { useReducer } from 'react';
import Cookies from 'js-cookie';
import { ADD_TO_FAV, REMOVE_FROM_FAV } from '../constants/actionTypes';
import {
  userInitialState,
  userReducer,
  cartInitialState,
  cartReducer,
} from '../reducers';

const Store = React.createContext();

const initialState = {
  darkMode: false,
  favs: Cookies.get('favs') ? JSON.parse(Cookies.get('favs')) : [],
};

function reducer(state, action) {
  switch (action.type) {
    case ADD_TO_FAV: {
      const fav = action.payload;
      const favs = [...state.favs, fav];

      Cookies.set('favs', JSON.stringify(favs));

      return { ...state, favs };
    }
    case REMOVE_FROM_FAV: {
      const fav = action.payload;
      const favs = state.favs.filter((e) => e !== fav);

      Cookies.set('favs', JSON.stringify(favs));

      return { ...state, favs };
    }
    default:
      return state;
  }
}

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [userState, userDispatch] = useReducer(userReducer, userInitialState);
  const [cartState, cartDispatch] = useReducer(cartReducer, cartInitialState);

  const value = {
    userState,
    userDispatch,
    state,
    dispatch,
    cartState,
    cartDispatch,
  };

  return <Store.Provider value={value}>{children}</Store.Provider>;
}

export { Store, StoreProvider };
