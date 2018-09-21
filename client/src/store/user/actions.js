import { sendRequestLogin, sendRequestLogout } from '../../services';

import { push } from 'react-router-redux';

export const loadUser = () => {
  return async function(dispatch) {
    const user = localStorage.getItem('user');
    if (user) {
      dispatch(loginDone(user));
      dispatch(push('/'));
    }
  };
};

export const login = (username, password) => {
  return async function(dispatch) {
    let response;
    try {
      dispatch(loginUser());
      response = await sendRequestLogin(username, password);
    } catch (error) {
      dispatch(loginError(error));
    }
    if (response) {
      localStorage.setItem('user', JSON.stringify(response));
      dispatch(loginDone(response));
      dispatch(push('/'));
    }
  };
};

export const LOGIN_USER = 'LOGIN_USER';
export const loginUser = () => ({
  type: LOGIN_USER
});

export const USER_ERROR = 'USER_ERROR';
export const loginError = error => ({
  type: USER_ERROR,
  error
});

export const USER_RECEIVED = 'USER_RECEIVED';
export const loginDone = user => ({
  type: USER_RECEIVED,
  user
});

export const logout = () => {
  return async function(dispatch) {
    let response;
    try {
      response = await sendRequestLogout();
    } catch (error) {
      console.log(error);
    }
    if (response) {
      localStorage.removeItem('user');
      dispatch(logoutDone(response));
    }
  };
};

export const LOGOUT_USER = 'LOGOUT_USER';
export const logoutDone = () => ({
  type: LOGOUT_USER
});
