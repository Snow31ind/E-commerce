import React, { useReducer } from 'react';
import Cookies from 'js-cookie';

const Store = React.createContext();

const initialState = {
  darkMode: false,
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null,
  cart: {
    cartItemIds: Cookies.get('cartItemIds')
      ? JSON.parse(Cookies.get('cartItemIds'))
      : [],
    shippingAddress: Cookies.get('shippingAddress')
      ? JSON.parse(Cookies.get('shippingAddress'))
      : {},
    paymentMethod: Cookies.get('paymentMethod')
      ? JSON.parse(Cookies.get('paymentMethod'))
      : '',
  },
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
    case 'ADD_TO_CART': {
      const newItemId = action.payload;

      const index = state.cart.cartItemIds.indexOf(newItemId);

      const cartItemIds =
        index > -1
          ? state.cart.cartItemIds
              .slice(0, index)
              .concat(newItemId)
              .concat(
                state.cart.cartItemIds.slice(
                  index,
                  state.cart.cartItemIds.length
                )
              )
          : state.cart.cartItemIds.concat(newItemId);

      Cookies.set('cartItemIds', JSON.stringify(cartItemIds));

      return { ...state, cart: { ...state.cart, cartItemIds } };
    }
    case 'REMOVE_FROM_CART': {
      const itemId = action.payload;

      const cartItemIds = state.cart.cartItemIds.filter(
        (cartItemId) => cartItemId !== itemId
      );

      Cookies.set('cartItemIds', JSON.stringify(cartItemIds));

      return { ...state, cart: { ...state.cart, cartItemIds } };
    }
    case 'CART_CLEAR': {
      const cartItemIds = [];

      Cookies.set('cartItemIds', JSON.stringify(cartItemIds));

      return { ...state, cart: { ...state.cart, cartItemIds } };
    }
    case 'DECREASE_ITEM_QUANTITY_TO_CART': {
      const itemId = action.payload;
      const lastIdx = state.cart.cartItemIds.lastIndexOf(itemId);
      const cartItemIds = state.cart.cartItemIds
        .slice(0, lastIdx)
        .concat(
          state.cart.cartItemIds.slice(
            lastIdx + 1,
            state.cart.cartItemIds.length
          )
        );

      Cookies.set('cartItemIds', JSON.stringify(cartItemIds));

      return { ...state, cart: { ...state.cart, cartItemIds } };
    }
    case 'INCREASE_ITEM_QUANTITY_TO_CART': {
      const itemId = action.payload;
      const cartItemIds = [...state.cart.cartItemIds, itemId];

      Cookies.set('cartItemIds', JSON.stringify(cartItemIds));

      return { ...state, cart: { ...state.cart, cartItemIds } };
    }
    case 'SAVE_SHIPPING_ADDRESS': {
      const shippingAddress = action.payload;

      Cookies.set('shippingAddress', JSON.stringify(shippingAddress));

      return { ...state, cart: { ...state.cart, shippingAddress } };
    }
    case 'SAVE_PAYMENT_METHOD': {
      const paymentMethod = action.payload;

      Cookies.set('paymentMethod', JSON.stringify(paymentMethod));

      return { ...state, cart: { ...state.cart, paymentMethod } };
    }
    default:
      return state;
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
