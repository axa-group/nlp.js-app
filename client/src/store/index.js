import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { responsiveStateReducer } from 'redux-responsive';
import { responsiveStoreEnhancer } from 'redux-responsive';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import { userReducer, intlFactoryReducer } from './reducer';

const loggerMiddleware = createLogger();
export const history = createBrowserHistory();

const middleware = [routerMiddleware(history), thunkMiddleware, loggerMiddleware];

const reducers = combineReducers({
  user: userReducer,
  intl: intlFactoryReducer(),
  browser: responsiveStateReducer
});

export const store = createStore(
  connectRouter(history)(reducers),
  compose(
    applyMiddleware(...middleware),
    responsiveStoreEnhancer
  )
);

export * from './actions';
