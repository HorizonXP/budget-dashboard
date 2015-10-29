import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import reducer from '../reducers';
import transitionMiddleware from '../middleware/transitionMiddleware';
import effects from 'redux-effects';
import {bearer} from 'redux-effects-credentials'
import headers from '../middleware/headersMiddleware';
import fetch from 'redux-effects-fetch';
import multi from 'redux-multi';

export default function createStore(reduxReactRouter, getRoutes, createHistory, cookieMiddleware, data) {
  let finalCreateStore;
  finalCreateStore = compose(applyMiddleware(multi, effects, cookieMiddleware, bearer(/\/api\//, state => state.user.get('token')), headers(/\/api\//), fetch, transitionMiddleware)
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
