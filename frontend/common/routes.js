import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { App, Home, SignedIn, SignedOut, Login } from './containers';

export default function initializeRoutes(store) {
  function requireAuth(nextState, replaceState) {
    const state = store.getState();
    const isLoggedIn = Boolean(state.user.loggedIn);
    if (!isLoggedIn) {
      replaceState({ nextPathname: nextState.location.pathname }, '/login');
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
