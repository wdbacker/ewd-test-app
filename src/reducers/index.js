import * as types from 'constants/ActionTypes';
import { combineReducers } from 'redux';

// define a messageText reducer method called by Redux
// modifies the state object in Redux
// you need to return a new state always and the action data needs to be copied to the state
// for complex data structures like objects, arrays, ..., use deepAssign method from immutableJS
function messageText(state = '', action) {
  switch (action.type) {
    case types.RECEIVE_ISC_MESSAGE:
      console.log('reduce RECEIVE_ISC_MESSAGE action: ', action);
      return action.text;

    default:
      return state;
  }
}

// all (sub)reducers must be combined to one single reducer
// Redux creates only one store for the whole application
export default combineReducers({
  messageText,
});
