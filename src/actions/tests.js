import * as types from 'constants/ActionTypes';

// message request action: post message text to EWD 3 back-end using ewd.send()
// sending is asynchronous, when ewd.send() completes, a second receiveIscMessage action is dispatched
// notice the ewd client is passed in by the Redux thunk middleware by destructuring the extraArgument { ewd }
export const requestIscMessage = (text) => {
  return (dispatch, getState, { ewd }) => {
    let messageObj = {
      type: 'test',
      //ajax: true,
      params: {
        text: text
      }
    };
    ewd.send(messageObj, function(messageObj) {
      //console.log('send messageObj: ', messageObj);
      dispatch(receiveIscMessage(messageObj.message));
      ewd.toastr('warning', 'ISC message received: ' + messageObj.message.text);
    });
  }
};

// return the message text received from EWD 3 synchronously as an action object
// to the Redux reducer (in reducers/index.js), is passed in there as action object
const receiveIscMessage = function(message) {
  //console.log('message: ', message);
  var text = (message ? message.text || '' : '') || '';
  return {
    type: types.RECEIVE_ISC_MESSAGE,
    text
  }
};
