import Cookies from 'js-cookie';
import {
  ADD_NEW_ITEM,
  CLEAR_CART,
  REMOVE_ITEM,
  SAVE_PAYMENT_METHOD,
  SAVE_SHIPPING_ADDRESS,
  UPDATE_ITEM_QUANTITY,
} from '../constants/actionTypes';
import { ITEMS, PAYMENT_METHOD, SHIPPING_ADDRESS } from '../constants/cookies';

const initialState = {
  loading: false,
  error: '',
  items: Cookies.get(ITEMS) ? JSON.parse(Cookies.get(ITEMS)) : [],
  shippingAddress: Cookies.get(SHIPPING_ADDRESS)
    ? JSON.parse(Cookies.get(SHIPPING_ADDRESS))
    : null,
  paymentMethod: Cookies.get(PAYMENT_METHOD)
    ? JSON.parse(Cookies.get(PAYMENT_METHOD))
    : '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_NEW_ITEM: {
      const id = action.payload;
      const newItems = [{ id, quantity: 1 }, ...state.items];

      Cookies.set(ITEMS, JSON.stringify(newItems));

      return { ...state, items: newItems };
    }

    case REMOVE_ITEM: {
      const id = action.payload;
      const newItems = state.items.filter((item) => item.id !== id);

      Cookies.set(ITEMS, JSON.stringify(newItems));

      return { ...state, items: newItems };
    }

    case CLEAR_CART: {
      Cookies.remove(ITEMS);
      return { ...state, items: [] };
    }

    case UPDATE_ITEM_QUANTITY: {
      const { id, quantity } = action.payload;
      const newItems = state.items.filter((item) =>
        item.id !== id ? item : { ...item, quantity: item.quantity + quantity }
      );

      Cookies.set(ITEMS, JSON.stringify(newItems));

      return { ...state, items: newItems };
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
  }
};

export { initialState as cartInitialState, reducer as cartReducer };
