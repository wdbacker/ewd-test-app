// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
 // injected into the application via DefinePlugin in Webpack configuration.

var REACT_APP = /^REACT_APP_/i;
var NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development');

module.exports = Object
  .keys(process.env)
  .filter(key => REACT_APP.test(key))
  .reduce((env, key) => {
    env['process.env.' + key] = JSON.stringify(process.env[key]);
    return env;
  }, {
    'process.env.NODE_ENV': NODE_ENV,
    'EWD_URL': JSON.stringify((NODE_ENV === '"development"') ? 'http://ewd3-dev.local:8090' : 'http://ewd3.ixh.be/dev'),
    'STORES_SUBPATH': JSON.stringify((NODE_ENV === '"development"') ? '/feder8/teststores' : '/feder8/stores'),
  });
