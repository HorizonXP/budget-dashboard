import {Map} from 'immutable';

import {setLoggedIn, setFirstName, setLastName, setEmail} from '../src/user.js';

export const INITIAL_STATE = Map({
  loggedIn: false,
  firstName: null,
  lastName: null,
  email: null
});

export default function reducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case 'SET_LOGGED_IN':
      return setLoggedIn(state, action.loggedIn);
    case 'SET_FIRST_NAME':
      return setFirstName(state, action.firstName);
    case 'SET_LAST_NAME':
      return setLastName(state, action.lastName);
    case 'SET_EMAIL':
      return setEmail(state, action.email);
  }
  return state;
}
