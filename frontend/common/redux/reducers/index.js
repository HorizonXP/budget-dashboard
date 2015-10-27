import { routerStateReducer } from 'redux-router';
import { combineReducers } from 'redux';
import user from './user';
import {reducer as form} from 'redux-form';
import cookies from './cookies';

export default docCookies => combineReducers({
  router: routerStateReducer,
  user: user,
  cookies: cookies(docCookies),
  form
});
