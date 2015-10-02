import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import thunk from 'redux-thunk';
import reducer from '../reducers';
import { devTools } from 'redux-devtools';

export default function configureStore(initialState, routes, createHistory) {
  const createStoreWithMiddleware = compose(
    applyMiddleware(thunk),
    reduxReactRouter({ routes, createHistory }),
    devTools()
  )(createStore);
  const store = createStoreWithMiddleware(reducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
