import {Map} from 'immutable';

export const LOAD = 'user/LOAD';
export const LOAD_SUCCESS = 'user/LOAD_SUCCESS';
export const LOAD_FAIL = 'user/LOAD_FAIL';
export const LOGIN = 'user/LOGIN';
export const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';
export const LOGIN_FAIL = 'user/LOGIN_FAIL';
export const LOGOUT = 'user/LOGOUT';
export const LOGOUT_SUCCESS = 'user/LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'user/LOGOUT_FAIL';

export const INITIAL_STATE = Map({
  loaded: false
});

export default function reducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case LOAD:
      return state.set('loading', true);
    case LOAD_SUCCESS:
      return state.set('loading', false).set('loaded', true).set('user', action.result).set('loggedIn', true).remove('error');
    case LOAD_FAIL:
      return state.set('loading', false).set('loaded', false).set('user', null).set('loggedIn', false).set('error', action.error.body);
    case LOGIN:
      return state.set('loggingIn', true);
    case LOGIN_SUCCESS:
      return state.set('loggingIn', false).set('user', action.result.user).set('token', action.result.token).set('loggedIn', true).remove('loginError');
    case LOGIN_FAIL:
      return state.set('loggingIn', false).set('user', null).set('token', null).set('loggedIn', false).set('loginError', action.error.body);
    case LOGOUT:
      return state.set('loggingOut', true);
    case LOGOUT_SUCCESS:
      return state.set('loggingOut', false).set('user', null).set('token', null).set('loggedIn', false).remove('logoutError');
    case LOGOUT_FAIL:
      return state.set('loggingOut', false).set('logoutError', action.error.body);
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.user && globalState.user.has('loaded') && globalState.user.has('token') && globalState.user.get('loaded');
}

export function getToken(globalState) {
  if (globalState.user && globalState.user.has('token')) {
    return globalState.user.get('token');
  } else {
    return null;
  }
}

export function load(token) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => { 
      return client.get('/v1/accounts/current', {
        token: token
      })
    }
  };
}

export function login(username, password) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/auth/login', {
      data: {
        username: username,
        password: password
      }
    })
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => {return new Promise((resolve, reject) => resolve())}
  };
}
