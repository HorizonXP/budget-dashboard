import 'babel-core/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import { reduxReactRouter, ReduxRouter } from 'redux-router';

import createStore from '../common/store/createStore';
import getRoutes from '../common/routes';
import makeRouteHooksSafe from '../common/helpers/makeRouteHooksSafe.js';

const initialState = window.__INITIAL_STATE__;
const store = createStore(reduxReactRouter, makeRouteHooksSafe(getRoutes), createHistory, initialState);

ReactDOM.render(
  <Provider store={store} key="provider">
    <ReduxRouter routes={getRoutes(store)}/>
  </Provider>,
  document
);
