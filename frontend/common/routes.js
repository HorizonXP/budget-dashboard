import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { App, Home, SignedIn, SignedOut, Login } from './containers';
import { isLoaded as isAuthLoaded, load as loadAuth, getToken } from './redux/reducers/user';

export default store => {
  const requireAuth = (nextState, replaceState, cb) => {
    function checkAuth() {
      const { user } = store.getState();
      const loggedIn = user.has('loggedIn') ? user.get('loggedIn') : false;
      if (!loggedIn) {
        let newState = nextState;
        newState['nextPathname'] = nextState.location.pathname;
        replaceState(newState, '/login');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      const token = getToken(store.getState());
      store.dispatch(loadAuth(token)).then(checkAuth);
    } else {
      checkAuth();
    }
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
