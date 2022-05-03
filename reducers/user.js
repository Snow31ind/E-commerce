import Cookies from 'js-cookie';
import {
  FULFILLED,
  PENDING,
  REJECTED,
  SIGNIN,
  SIGNOUT,
  SIGNUP,
} from '../constants/actionTypes';

const initialState = {
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null,
  loading: false,
  error: '',
};

const reducer = (state, action) => {
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

    case SIGNIN: {
      const user = action.payload;
      Cookies.set('user', JSON.stringify(user));

      return { ...state, user };
    }

    case SIGNUP: {
      const user = action.payload;
      Cookies.set('user', JSON.stringify(user));

      return { ...state, user };
    }

    case SIGNOUT: {
      Cookies.remove('user');

      return { ...state, user: null };
    }
  }
};

export { initialState as userInitialState, reducer as userReducer };
