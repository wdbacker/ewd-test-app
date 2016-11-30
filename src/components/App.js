import React, { PropTypes, createFactory } from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { ToastContainer, ToastMessage } from 'react-toastr';
import { requestIscMessage }  from '../actions/tests';
import 'styles/app.scss';
import 'bootstrap/dist/css/bootstrap.css';

// our main App component, contains the main App functionality
class App extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    // bind handleSubmit to App component scope
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // load and augment the ewd client for this module...
    let { ewd } = this.props;
    const component = this;
    // add toast container to ewd client to display warnings
    ewd.toastr = function(type, text) {
      if (type && type !== '' && component._toastContainer && component._toastContainer[type]) {
        component._toastContainer[type](text);
      }
    };
    // shortcut method for displaying errors
    ewd.displayError = function(error) {
      ewd.toastr('error', error);
    };
  }

  componentDidMount() {
    const { ewd } = this.props;
    console.log('App started!');
		ewd.toastr('success', 'Test App started!');
  }

  handleSubmit(e) {
    const { dispatch } = this.props;

    // prevent default form submitting by browser
    e.preventDefault();
    // pick up message text value entered by user
    const message = this._messageInput.value.trim();
    if (message) {
      // dispatch a requestIscMessage action to actions/tests.js
      dispatch(requestIscMessage(message));
      this._messageInput.value = '';
    }
  }

  render() {
		const ToastMessageFactory = createFactory(ToastMessage.animation);
    const { messageText } = this.props;

    // instantiate ToastContainer component for displaying warnings to the user
    // add a small form containing the message text input, add a reference to the textinput to the <App> component for handleSubmit()
    // display the messageText we received from teh EWD 3 server and show it, this property is updated by changing the state in reducers/index.js
    // because state.messageText is mapped to the messageText prop (see last line), the UI will be updated by React
    return (
      <span>
				<ToastContainer
					ref={(c) => { this._toastContainer = c; }} // strings refs are deprecated
					toastMessageFactory={ToastMessageFactory}
					className="toast-top-right"
					newestOnTop={true}
					target="body"
				/>
        <div>
          <form onSubmit={e => this.handleSubmit(e)}>
            <FormGroup>
              <ControlLabel>Message to ISC back-end:</ControlLabel>
              <input className="form-control" type="text" placeholder="Enter message" ref={(c) => {this._messageInput = c}} />
            </FormGroup>
          </form>
          <div>
            <b>Message from ISC back-end: {messageText}</b>
          </div>
        </div>
      </span>
    );
  }
}

// create a mapStateToProps function to create a property object (identical to the state content here)
const mapStateToProps = state => ({ ...state });

// connect with Redux the internal/immutable Redux state to the props of the <App> component
export default connect(mapStateToProps)(App);
