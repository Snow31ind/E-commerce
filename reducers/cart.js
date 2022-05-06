import Cookies from 'js-cookie';
import {
  ADD_NEW_ITEM,
  CLEAR_CART,
  FETCH_CART,
  FULFILLED,
  PENDING,
  REJECTED,
  REMOVE_ITEM,
  SAVE_PAYMENT_METHOD,
  SAVE_SHIPPING_ADDRESS,
  UPDATE_ITEM_QUANTITY,
} from '../constants/actionTypes';
import { ITEMS, PAYMENT_METHOD, SHIPPING_ADDRESS } from '../constants/cookies';

const initialState = {
  loading: false,
  error: '',
  cart: [],
  items: Cookies.get(ITEMS) ? JSON.parse(Cookies.get(ITEMS)) : [],
  shippingAddress: Cookies.get(SHIPPING_ADDRESS)
    ? JSON.parse(Cookies.get(SHIPPING_ADDRESS))
    : null,
  paymentMethod: Cookies.get(PAYMENT_METHOD)
    ? JSON.parse(Cookies.get(PAYMENT_METHOD))
    : '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case PENDING: {
      return { ...state, loading: true };
    }

    case FULFILLED: {
      return { ...state, loading: false };
    }

    case REJECTED: {
      return { ...state, error: action.payload, loading: false };
    }

    case ADD_NEW_ITEM: {
      const product = action.payload;
      // Add {id, quantity} if new item into the field items
      const items = [{ _id: product._id, quantity: 1 }, ...state.items];

      // Add product to cart
      const cart = [{ ...product, quantity: 1 }, ...state.cart];

      Cookies.set(ITEMS, JSON.stringify(items));

      return { ...state, items, cart };
    }

    case REMOVE_ITEM: {
      const _id = action.payload;
      const items = state.items.filter((item) => item._id !== _id);

      Cookies.set(ITEMS, JSON.stringify(items));

      const cart = state.cart.filter((item) => item._id !== _id);

      return { ...state, items, cart };
    }

    case CLEAR_CART: {
      Cookies.remove(ITEMS);
      return { ...state, items: [] };
    }

    case UPDATE_ITEM_QUANTITY: {
      const { _id, quantity } = action.payload;

      const items = state.items.map((item) =>
        item._id !== _id
          ? item
          : { ...item, quantity: item.quantity + quantity }
      );

      Cookies.set(ITEMS, JSON.stringify(items));

      const cart = state.cart.map((item) =>
        item._id !== _id
          ? item
          : { ...item, quantity: item.quantity + quantity }
      );

      return { ...state, items, cart };
    }

    case SAVE_SHIPPING_ADDRESS: {
      const shippingAddress = action.payload;

      Cookies.set(SHIPPING_ADDRESS, JSON.stringify(shippingAddress));

      return { ...state, shippingAddress };
    }

    case SAVE_PAYMENT_METHOD: {
      const paymentMethod = action.payload;

      Cookies.set(PAYMENT_METHOD, JSON.stringify(paymentMethod));

      return { ...state, paymentMethod };
    }

    case FETCH_CART: {
      const cart = action.payload;

      return { ...state, cart };
    }
  }
};

export { initialState as cartInitialState, reducer as cartReducer };
