import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { EWD, EWDProvider } from './react-ewd';
import App from 'components/App';
import Spinner from 'react-spinner';
import reducers from './reducers';
import fetch from 'isomorphic-fetch';
import 'styles/app.scss';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

// first, instantiate the EWD 3 client for this test application
// the EWD 3 server needs to be running on localhost, port 8090 with the ewd-test-app module installed
// the EWD 3 client instance contains a custom ajax function, implemented using the new fetch browser API
// by default, WebSockets are used to link to the EWD 3 server
let ewd = EWD({
  application: 'ewd-test-app', // application name
	log: true,
	url: 'http://localhost:8090',
	ajax: function(params, done, fail) {
		var headers = new Headers({
			"Content-Type": params.contentType || 'application/json'
		});

		fetch(params.url, {
			method: (params.type || params.method || 'GET').toUpperCase(),
			// mode: 'cors', (cors is the default)
			headers: headers,
			body: JSON.stringify(params.data || ''),
			timeout: params.timeout || 30000
		}).then(response => {
			if (response.ok) {
				return response.json().then(json => {
					done(json);
				});
			}
			else {
				throw Error(response.statusText);
			}
		}).catch(err => {
      // eslint-disable-next-line no-unused-expressions
      ewd.displayError && ewd.displayError('fetch error: ' + err);
			console.log('fetch error: ', err);
			fail(err);
		});
	},
	no_sockets: false,
	registeredCallback: function() {
		console.log('registered callback called');
	},
});

// we instantiate this object to pass the EWD 3 client to the Redux action methods in actions/tests.js
let extraThunkArgument = { ewd };

// instantiate the Redux store with thunk middleware, this allows to dispatch actions asynchronously
// devToolsExtension is needed to enable the Redux DevTools for debugging in the browser
const store = createStore(reducers, compose(applyMiddleware(thunk.withExtraArgument(extraThunkArgument)), window.devToolsExtension ? window.devToolsExtension() : f => f));

// main EWD 3 React container component (similar to the Top component in the ewd-xpress-react loader)
function ProviderContainer(props) {
  let styles = {
    MainDiv: { padding: 20 },
    Spinner: { width: '100%', height: 100 },
  };

  // instantiate the Redux Provider with its store as property
  // before the connection to the EWD 3 server is registered, a waiting Spinner is shown
  // once the connection is registered, React renders our <App>
  return (
    <Provider store={store}>
      <div style={styles.MainDiv}>
        {
          props.ewdProviderState.registered ?
            <App ewd={ewd} />
          :
            <div style={styles.Spinner}>
              <Spinner />
            </div>
        }
      </div>
    </Provider>
  )
}

// main starting point of each React/Redux application
// instantiates the EWDProvider component where the ewd client instance is passed in as a property (for use in your components)
render(
  <EWDProvider ewd={ewd}>
    <ProviderContainer />
  </EWDProvider>,
  document.getElementById('content')
);
