const express         = require('express');
const http            = require('http');
const path            = require('path');
const bodyParser      = require('body-parser');
const favicon         = require('serve-favicon');
const errorhandler    = require('errorhandler');
const logger          = require('morgan');
const methodOverride  = require('method-override');

const config          = require('./config/config');

// Our custom request logger
const authentication       = require('./lib/authentication');
const registration         = require('./lib/registration');
const databaseHandler      = require('./scripts/databaseHandler');

const app = express();

// all environments
app.set('port', process.env.PORT || config.APP_PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(favicon(__dirname + '/views/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());

app.use(errorhandler());

app.use('/static', express.static(__dirname + '/public'));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,auth_token, user_id');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

/**--------------------------------------------------------
 *                      AUTHENTICATION
 *---------------------------------------------------------
 */
app.post('/auth/login',                    authentication.loginUser);
app.get('/auth/logout',                    authentication.logOut);

/**--------------------------------------------------------
 *                      REGISTRATION
 *---------------------------------------------------------
 */
app.post('/event/register',                   registration.register);
app.get('/event/get_registration',            registration.getRegistrations);
app.get('/event/get_registration_id',         registration.getRegistrationById);

var httpServer = http.createServer(app).listen(config.APP_PORT, function() {
  console.log('CSP HTTP server listening on port ' + config.APP_PORT);
});
