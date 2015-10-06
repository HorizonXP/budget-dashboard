import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { App, Home, SignedIn, SignedOut, Login } from './containers';
import { replaceState } from 'redux-router';

export default function initializeRoutes(store) {
  function requireAuth(nextState, oldReplaceState) {
    const state = store.getState();
    const isLoggedIn = Boolean(state.user.loggedIn);
    if (!isLoggedIn) {
      const action = replaceState({ nextPathname: nextState.location.pathname }, '/login');
      store.dispatch(action);
      // reduxReplaceState(null, '/login', { nextPathname: location.pathname });
    }
  }
  const routes = (
    <Route component={App}>
      <Route component={SignedOut}>
        <Route path="/login" component={Login} />
      </Route>
      <Route component={SignedIn} onEnter={requireAuth}>
        <Route path="/" component={Home}/>
      </Route>
    </Route>
  );
  return routes;
};
