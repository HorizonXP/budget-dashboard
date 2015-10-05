import { routerStateReducer } from 'redux-router';
import { combineReducers } from 'redux';
import userReducer from './user.js';

const rootReducer = combineReducers({
  router: routerStateReducer,
  user: userReducer
});

export default rootReducer;
