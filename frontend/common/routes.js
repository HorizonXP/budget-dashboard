import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { App, Home, SignedIn, SignedOut, Login } from './containers';

export default (store) => {
  const requireAuth = (nextState, replaceState, cb) => {
    function checkAuth() {
      const { user } = store.getState();
      const loggedIn = user.get('loggedIn');
      if (!loggedIn) {
        let newState = nextState;
        newState['nextPathname'] = nextState.location.pathname;
        replaceState(newState, '/login');
      }
      cb();
    }

    checkAuth();
  };
  return (
    <Route component={App}>
      <Route component={SignedOut}>
        <Route path="/login" component={Login} />
      </Route>
      <Route component={SignedIn} onEnter={requireAuth}>
        <Route path="/" component={Home}/>
      </Route>
    </Route>
  );
};
