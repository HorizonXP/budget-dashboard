import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter, historyMiddleware } from 'redux-router';
import thunk from 'redux-thunk';
import reducer from '../reducers';
import { devTools } from 'redux-devtools';

/**
 * Logs all actions and states after they are dispatched.
 */

const logger = store => next => action => {
  const hasGroup = console.hasOwnProperty('group');
  hasGroup ? console.group(action.type) : console.log(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  hasGroup ? console.groupEnd(action.type) : console.log("End: " + action.type);
  return result;
};

export default function configureStore(initialState, createHistory) {
  const createStoreWithMiddleware = compose(
    applyMiddleware(thunk),
    reduxReactRouter({ createHistory }),
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
