import {createAction} from 'redux-actions'
import {fetch} from 'redux-effects-fetch'
import {bind} from 'redux-effects'
import {cookie} from 'redux-effects-cookie'
import util from 'util';
import { replaceState } from 'redux-router';
import parseToken from '../../helpers/parseToken';

const loadUser = createAction('LOAD_USER');
const loadUserSuccess = createAction('LOAD_USER_SUCCESS');
const loadUserFail = createAction('LOAD_USER_FAIL');

const loginUser = createAction('LOGIN');
const loginUserSuccess = createAction('LOGIN_SUCCESS');
const loginUserFail = createAction('LOGIN_FAIL');

const logoutUser = createAction('LOGOUT');
const logoutUserSuccess = createAction('LOGOUT_SUCCESS');
const logoutUserFail = createAction('LOGOUT_FAIL');

const refreshToken = createAction('REFRESH_TOKEN');
const refreshTokenSuccess = createAction('REFRESH_TOKEN_SUCCESS');
const refreshTokenFail = createAction('REFRESH_TOKEN_FAIL');

const setToken = createAction('SET_TOKEN');

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  if (__SERVER__) {
    // Prepend host and port of the API server to the path.
    return 'http://localhost/api' + adjustedPath
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return '/api' + adjustedPath;
}

function accessTokenCookie(token) {
  if (token !== undefined) {
    const tokenObj = parseToken(token);
    let options = {};
    if (tokenObj) {
      options['expires'] = (new Date(tokenObj.exp*1000));
    }
    return cookie('access_token', token, options);
  } else {
    return cookie('access_token');
  }
}

export function isLoaded(globalState) {
  return globalState.user && globalState.user.has('loaded') && globalState.user.has('token') && globalState.user.get('token') !== null && globalState.user.get('loaded');
}

export function getToken(globalState) {
  if (globalState.user && globalState.user.has('token')) {
    return globalState.user.get('token');
  } else {
    return null;
  }
}

export function load(getFromCookie) {
  const fetchLoad = bind(
    fetch(formatUrl('/v1/accounts/current/'), {
      method: 'GET',
    }),
    loadUserSuccess,
    loadUserFail
  );
  if (getFromCookie) {
    return [
      loadUser(),
      bind(
        accessTokenCookie(),
        token => bind(
          setToken(token),
          () => fetchLoad
        )
      )
    ]
  } else {
    return [
      loadUser(),
      fetchLoad
    ]
  }
}

export function refresh(token) {
  return [
    refreshToken(),
    bind(
      fetch(formatUrl('/auth/refresh/'), {
        method: 'POST',
        body: JSON.stringify({
          token: token
        })
      }),
      newToken => bind(
        accessTokenCookie(newToken.token),
        () => refreshTokenSuccess(newToken) 
      ),
      refreshTokenFail
    )
  ]
}

export function login(username, password) {
  return [
    loginUser(),
    bind(
      fetch(formatUrl('/auth/login/'), {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          password: password
        })
      }),
      user => bind(
        accessTokenCookie(user.token),
        () => loginUserSuccess(user)
      ),
      error => bind(
        accessTokenCookie(null),
        () => loginUserFail(error)
      )
    )
  ]
}

export function logout() {
  return [
    logoutUser(),
    bind(
      accessTokenCookie(null),
      logoutUserSuccess
    )
  ]
}
