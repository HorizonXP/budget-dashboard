import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import reducer from '../reducers';
import transitionMiddleware from '../middleware/transitionMiddleware';
import effects from 'redux-effects';
import {bearer} from 'redux-effects-credentials'
import headers from '../middleware/headersMiddleware';
import refreshToken from '../middleware/refreshTokenMiddleware';
import fetch from 'redux-effects-fetch';
import multi from 'redux-multi';
import logger from '../middleware/loggerMiddleware';

export default function createStore(reduxReactRouter, getRoutes, createHistory, cookieMiddleware, data) {
  let finalCreateStore;
  const apiPattern = /\/api\//;
  const getToken = state => state.user.get('token');
  const getTokenVal = state => {
    const tokenObj = state.user.get('token');
    if (tokenObj) {
      return tokenObj.token;
    } else {
      return null;
    }
  };
  finalCreateStore = compose(
    applyMiddleware(
      multi,
      effects,
      cookieMiddleware,
      headers(apiPattern),
      refreshToken(apiPattern, getToken),
      bearer(apiPattern, getTokenVal),
      fetch,
      transitionMiddleware,
      logger
    )
  )(_createStore);
  finalCreateStore = reduxReactRouter({ getRoutes, createHistory })(finalCreateStore);

  const store = finalCreateStore(reducer, data);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
