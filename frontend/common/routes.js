import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { App, Home, SignedIn, SignedOut, Login } from './containers';
import { replaceState as reduxReplaceState } from 'redux-router';

function requireAuth(location, replaceWith) {
  if (!nextState.user.loggedIn) {
    reduxReplaceState(null, '/login', { nextPathname: location.pathname })
  }
}

const routes = (
  <Route path="/" component={App}>
    <Route component={SignedOut}>
      <Route path="login" component={Login} />
    </Route>
    <Route component={SignedIn} onEnter={requireAuth}>
      <Route component={Home}/>
    </Route>
  </Route>
);

export default routes;
