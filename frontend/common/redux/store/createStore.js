import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';
import clientMiddleware from '../middleware/clientMiddleware';
import transitionMiddleware from '../middleware/transitionMiddleware';

export default function createStore(reduxReactRouter, getRoutes, createHistory, client, docCookies, data) {
  let finalCreateStore;
  finalCreateStore = compose(
    applyMiddleware(thunk, clientMiddleware(client), transitionMiddleware)
  )(_createStore);
  finalCreateStore = reduxReactRouter({ getRoutes, createHistory })(finalCreateStore);

  const store = finalCreateStore(reducer(docCookies), data);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
