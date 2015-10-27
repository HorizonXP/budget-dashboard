import 'babel-core/polyfill';

global.__CLIENT__ = true;
global.__SERVER__ = false;

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import { reduxReactRouter, ReduxRouter } from 'redux-router';

import createStore from '../common/redux/store/createStore';
import getRoutes from '../common/routes';
import makeRouteHooksSafe from '../common/helpers/makeRouteHooksSafe.js';
import ApiClient from '../common/helpers/ApiClient.js';
import 'whatwg-fetch';
import { fromJSON } from 'transit-immutable-js';
import docCookies from '../common/helpers/docCookies';

const initialState = fromJSON(window.__INITIAL_STATE__);
const client = new ApiClient(fetch);
const cookieDoc = {};
Object.defineProperty(cookieDoc, "cookie", {
  get: () => document.cookie,
  set: (cookie) => document.cookie = cookie
});

const store = createStore(reduxReactRouter, makeRouteHooksSafe(getRoutes), createHistory, client, docCookies(cookieDoc), initialState);

ReactDOM.render(
  <Provider store={store} key="provider">
    <ReduxRouter routes={getRoutes(store)}/>
  </Provider>,
  document
);
