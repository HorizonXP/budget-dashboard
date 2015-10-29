import { routerStateReducer } from 'redux-router';
import { combineReducers } from 'redux';
import user from './user';
import {reducer as form} from 'redux-form';

export default combineReducers({
  router: routerStateReducer,
  user,
  form
});
