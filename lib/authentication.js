const async       = require('async');
const crypto      = require('crypto');
const bcrypt      = require('bcryptjs');
const moment      = require('moment');
const xss         = require('xss');

//----------------------- imported modules ---------------
const commonFun         = require('./commonfunction');
const responses         = require('./response');
const dbHandler         = require('../scripts/databaseHandler').dbHandler;
const constants         = require('./constants');
const config            = require('../config/config');

//----------------------- exported modules ---------------
exports.loginUser                       = loginUser;
exports.logOut                          = logOut;
exports.validateAccessToken             = validateAccessToken;
exports.insertPublicAccessToken         = insertPublicAccessToken;

/*
 * ----------------------------------
 * CREATION OF USERS ACCOUNT
 * ----------------------------------
 */

function loginUser(req, res){
  var handlerInfo = {
    apiModule  : 'authentication',
    apiHandler : 'loginUser'
  };

  var email       = req.body.email;
  var password    = req.body.password;

  var manvalues = [email, password];
  var checkblank = commonFun.checkBlank(manvalues);

  if (checkblank ) {
    return responses.sendParameterMissingResponse(handlerInfo, res);
  }

  var getUser = 'SELECT id, password, username FROM ' + config.user_table + ' WHERE email = ? ';
  var getUserQuery = dbHandler.getInstance().executeQuery(getUser, [email], function(err, user){
    if(err){
      return responses.sendFailureResponse(handlerInfo, res, 'Failed to execute find user query', err);
    }
    var data = {};
    if(user.length) {
      if(!bcrypt.compareSync(password, user[0].password)){
        return responses.sendIncorrectPasswordResponse(handlerInfo, res);
      }

      insertPublicAccessToken(handlerInfo, email, function(err, auth_token){
        data.auth_token = auth_token;
        data.user_id = user[0].id;
        return responses.sendSuccessResponse(handlerInfo, res, 'Signin Successful', data);
      });
    } else {
      return responses.sendNoUserFoundResponse(handlerInfo, res);
    }
  });
}

function logOut(req, res){
  var handlerInfo = {
    apiModule  : 'authentication',
    apiHandler : 'logOut'
  };

  var authToken       = req.headers.auth_token;
  var userId          = req.headers.user_id;

  var manvalues = [authToken, userId];
  var checkblank = commonFun.checkBlank(manvalues);

  if (checkblank ) {
    return responses.sendParameterMissingResponse(handlerInfo, res);
  }
  validateAccessToken(handlerInfo, authToken, userId, function(err, user) {
    if (err) {
      return responses.sendAuthenticationFailure(handlerInfo, res);
    }

    var sql = 'UPDATE ' + config.user_table + ' SET auth_token = \'\' WHERE id = ? ';
    var sqlQuery = dbHandler.getInstance().executeQuery(sql, [userId], function(err, logOut){
      if(err){
        return responses.sendFailureResponse(handlerInfo, res, 'Failed to log out user', err);
      }
      responses.sendSuccessResponse(handlerInfo, res, 'You have successfully logged out', {});
    });
  });
}

/*
 * ----------------------------------
 * VALIDATE Access Token
 * ----------------------------------
 */
function validateAccessToken(handlerInfo, auth_token, userId, callback){
  var query = 'SELECT id, username FROM ' + config.user_table + ' WHERE auth_token = ? AND id = ? ';
  var getQuery = dbHandler.getInstance().executeQuery(query, [auth_token, userId], function(err, user){
    if(err){
      return callback(err);
    }
    if (user[0]) {
      return callback(null, user[0]);
    } else {
      err = new Error();
      err.flag = constants.responseFlags.INVALID_ACCESS_TOKEN;
      return callback(err);
    }

  });
}

// ----------- Generate Access Token ------------------------------------
function insertPublicAccessToken(handlerInfo, emailId, callback){
  generateUniqueToken(handlerInfo, function(err, accessToken){
    var updateToken = 'UPDATE ' + config.user_table + ' SET auth_token = ? WHERE email = ?';
    dbHandler.getInstance().executeQuery(updateToken, [accessToken, emailId], function(err, result){
      if(err){
        return callback(err);
      }
      callback(null, accessToken);
    });
  });

  // Generate a unique identifier for the transaction
  function generateUniqueToken(handlerInfo, callback){
    var accessToken = crypto.pseudoRandomBytes(32).toString('hex');
    var getDuplicate = 'SELECT COUNT(*) as existing FROM ' + config.user_table + ' WHERE auth_token = ?';
    var query = dbHandler.getInstance().executeQuery(getDuplicate, [accessToken], function(err, result){
      if(err){
        return callback(err);
      }
      if(result[0].existing > 0){
        generateUniqueToken(handlerInfo, callback);
      }
      else{
        return callback(null, accessToken);
      }
    });
  }
}
