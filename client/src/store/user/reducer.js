import { LOGIN_USER, USER_RECEIVED, USER_ERROR, LOGOUT_USER } from './actions';

const initialState = {
  isLogged: false,
  isFetching: false,
  user: {},
  error: {}
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        isFetching: true
      };
    case USER_RECEIVED:
      return {
        ...state,
        isFetching: false,
        isLogged: true,
        user: { ...state.user, ...action.user }
      };
    case USER_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case LOGOUT_USER:
      return {
        ...state,
        isFetching: false,
        isLogged: false
      };
    default:
      return state;
  }
};

export default userReducer;
