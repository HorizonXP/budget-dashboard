import 'babel-core/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import { ReduxRouter } from 'redux-router';

import configureStore from '../common/store/configureStore';
import initializeRoutes from '../common/routes';

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState, createHistory);
const routes = initializeRoutes(store);
console.log(initialState);

ReactDOM.render(
  <Provider store={store}>
    <ReduxRouter>
      {routes}
    </ReduxRouter>
  </Provider>,
  document
);
