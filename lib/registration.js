const async       = require('async');
const crypto      = require('crypto');
const bcrypt      = require('bcryptjs');
const moment      = require('moment');
const xss         = require('xss');
const url         = require('url');

//----------------------- imported modules ---------------
const commonFun         = require('./commonfunction');
const responses         = require('./response');
const dbHandler         = require('../scripts/databaseHandler').dbHandler;
const constants         = require('./constants');
const config            = require('../config/config');
const authentication     = require('./authentication');

//----------------------- exported modules ---------------
exports.register             =  register;
exports.getRegistrations     =  getRegistrations;
exports.getRegistrationById  =  getRegistrationById;

function register(req, res){
  var handlerInfo = {
    apiModule  : 'registration',
    apiHandler : 'register'
  };

  const name              = req.body.name;
  const mobile            = req.body.mobile;
  const email             = req.body.email;
  const registrationType  = req.body.registrationType;
  const tickets           = req.body.tickets;

  const manvalues = [email, name, mobile, registrationType, tickets];
  const checkblank = commonFun.checkBlank(manvalues);

  if (checkblank ) {
    return responses.sendParameterMissingResponse(handlerInfo, res);
  }

  var sql = 'INSERT into ' + config.data_table + ' (name, email, mobile, registration_type, tickets_count) SELECT * from (SELECT "' +
  name + '", "' + email +'", "' + mobile +'", "' + registrationType +'", "' + tickets +'") as tmp' + ' WHERE NOT EXISTS ( '+
    'SELECT email, mobile from ' + config.data_table + ' WHERE email = "' + email + '" AND mobile = "' + mobile + '") LIMIT 1;'

  var sqlQuery = dbHandler.getInstance().executeQuery(sql, [], function(err, org){
    if(err){
      return responses.sendFailureResponse(handlerInfo, res, 'Error in storing Registration', err);
    }
    if(!org.insertId) {
      return responses.sendFailureResponse(handlerInfo, res, 'Duplicate Registration Entry', err);
    }
    var data = {};
    data.regId = org.insertId;
    responses.sendSuccessResponse(handlerInfo, res, 'Registration successfully saved', data);
  });
}

function getRegistrations(req, res){
  var handlerInfo = {
    apiModule  : 'registration',
    apiHandler : 'getRegistrations'
  };

  var authToken       =   req.headers.auth_token;
  var userId          =   req.headers.user_id;

  var manvalues = [authToken, userId];
  var checkblank = commonFun.checkBlank(manvalues);

  if (checkblank) {
    return responses.sendParameterMissingResponse(handlerInfo, res);
  }

  authentication.validateAccessToken(handlerInfo, authToken, userId, function(err, user){
    if(err){
      return responses.sendAuthenticationFailure(handlerInfo, res);
    }

    const query = 'SELECT id, name, email, mobile, registration_type, tickets_count from ' + config.data_table;
    const sqlQuery = dbHandler.getInstance().executeQuery(query, [], function(err, reg){
      if(err){
        return responses.sendFailureResponse(handlerInfo, res, 'Failed to fetch registrations', err);
      }
      var regs = [];
      for (var i in reg) {
        regs.push(reg[i]);
      }
      responses.sendSuccessResponse(handlerInfo, res, 'registrations', reg);
    });
  });
}

function getRegistrationById(req, res){
  var handlerInfo = {
    apiModule  : 'registration',
    apiHandler : 'getRegistrations'
  };

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  var regId = query.id;

  var authToken       =   req.headers.auth_token;
  var userId          =   req.headers.user_id;

  var manvalues = [authToken, userId];
  var checkblank = commonFun.checkBlank(manvalues);

  if (checkblank) {
    return responses.sendParameterMissingResponse(handlerInfo, res);
  }

  authentication.validateAccessToken(handlerInfo, authToken, userId, function(err, user){
    if(err){
      return responses.sendAuthenticationFailure(handlerInfo, res);
    }

    const query = 'SELECT id, name, email, mobile, registration_type, tickets_count from ' + config.data_table  +
      ' WHERE id = ?';
    const sqlQuery = dbHandler.getInstance().executeQuery(query, [regId], function(err, reg){
      if(err){
        return responses.sendFailureResponse(handlerInfo, res, 'Failed to fetch registrations', err);
      }
      var regs = [];
      for (var i in reg) {
        regs.push(reg[i]);
      }
      responses.sendSuccessResponse(handlerInfo, res, 'registrations', reg);
    });
  });
}
