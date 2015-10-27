import {Map} from 'immutable';

import { LOGIN, LOGIN_SUCCESS, LOGIN_FAIL } from './user';
import { LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL } from './user';

export const LOAD = 'cookies/LOAD';
export const LOAD_SUCCESS = 'cookies/LOAD_SUCCESS';
export const LOAD_FAIL = 'cookies/LOAD_FAIL';

export const INITIAL_STATE = Map({
  'loaded': false,
});

export default (docCookies) => (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case LOAD:
      return state.set('loading', true);
    case LOAD_SUCCESS:
      let newState = state.set('loading', false).set('loaded', true).remove('error');
      let cookies = Map({});

      if (docCookies) {
        const keys = docCookies.keys();
        for (var key in keys) {
          cookies = cookies.set(key, docCookies.getItem(key));
        }
      }
      return newState.set('cookies', cookies);
    case LOAD_FAIL:
      return state.set('loading', false).set('loaded', false);
    case LOGIN_SUCCESS:
      if (docCookies) {
        docCookies.setItem('access_token', action.result.token, null, '/', 'localhost', null);
      }
      return state;
    case LOGIN_FAIL:
      if (docCookies) {
        docCookies.setItem('access_token', null);
      }
      return state;
    case LOGOUT_SUCCESS:
      if (docCookies) {
        docCookies.setItem('access_token', null);
      }
      return state;
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.cookies && globalState.cookies.has('loaded') && globalState.cookies.get('loaded');
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: () => new Promise((resolve, reject) => resolve())
  };
}
