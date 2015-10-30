/**
 * Logs all actions and states after they are dispatched.
 */
export default store => next => action => {
  console.log("⎢ " + action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.log("⎢ " + 'next state', store.getState());
  console.log('⎣ ' + action.type);
  return result;
};
