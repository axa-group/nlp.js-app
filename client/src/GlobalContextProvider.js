import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import ReduxConnectedIntlProvider from './ReduxConnectedIntlProvider';

import { store, history } from './store';

const GlobalContextProvider = WrappedComponent => props => {
  return (
    <Provider store={store}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <WrappedComponent {...props} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </Provider>
  );
};

export default GlobalContextProvider;
