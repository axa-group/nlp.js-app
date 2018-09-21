import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Login from './pages/Login';
import Home from './pages/Home';
import { PrivateRoute } from './components/common';

import GlobalContextProvider from './GlobalContextProvider';
import { media, colors } from './theme';

class App extends Component {
  getChildContext() {
    return {
      media,
      colors
    };
  }
  render() {
    return (
      <div>
        <Switch>
          <Route path="/login" component={Login} />
          <PrivateRoute path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}

App.childContextTypes = {
  media: PropTypes.object,
  colors: PropTypes.object
};

export default GlobalContextProvider(App);
