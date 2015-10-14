import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';
import { devTools } from 'redux-devtools';

export default function createStore(reduxReactRouter, getRoutes, createHistory, data) {
  let finalCreateStore;
  finalCreateStore = compose(
    applyMiddleware(thunk),
    devTools()
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
