var constants = require('./constants');

exports.setResponseHeaders              =   setResponseHeaders;
exports.sendAuthenticationFailure       =   sendAuthenticationFailure;
exports.sendNoUserFoundResponse         =   sendNoUserFoundResponse;
exports.sendIncorrectPasswordResponse   =   sendIncorrectPasswordResponse;
exports.sendUnauthorizedAccessResponse  =   sendUnauthorizedAccessResponse;
exports.sendFailureResponse             =   sendFailureResponse;
exports.sendSuccessResponse             =   sendSuccessResponse;
exports.sendParameterMissingResponse    =   sendParameterMissingResponse;


function setResponseHeaders(request, response, responseCode, payload) {
  response.setHeader('Access-Control-Allow-Origin', request.headers.origin ? request.headers.origin : '*');
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Content-Security-Policy');
  response.writeHead(responseCode);
  if (payload) {
    response.write(payload);
  }
  response.end();
}

function sendAuthenticationFailure(handlerInfo, res){
  var response = {
    status    :   constants.responseFlags.INVALID_ACCESS_TOKEN,
    message   :   'Unauthorized'
  };
  res.status(401);
  res.send(response);
}

function sendNoUserFoundResponse(handlerInfo, res){
    var response = {
        status : constants.responseFlags.USER_NOT_FOUND,
        message  : 'You are not registered with us. Please SignUp.'};
    res.send(response);
}

function sendIncorrectPasswordResponse(handlerInfo, res){
    var response = {
        status : constants.responseFlags.INCORRECT_PASSWORD,
        message  : 'You have entered wrong password. Please try again.'};
    res.send(response);
}

function sendUnauthorizedAccessResponse(handlerInfo, res){
    var response = {
        status : constants.responseFlags.UNAUTHORIZED_ACCESS,
        message  : 'You are not authorised to perform this action'};
    res.send(response);
}

function sendFailureResponse(handlerInfo, res, msg, err){
    var response = {
        status    :   constants.responseFlags.ACTION_FAILED,
        message   :   msg
    };
    res.send(response);
}

function sendSuccessResponse(handlerInfo, res, msg, data){
    var response = {
        status  :   constants.responseFlags.ACTION_COMPLETE,
        message :   msg,
        data    :   data
    };
    res.send(response);
}

function sendParameterMissingResponse(handlerInfo, res) {
    var response = {
        status    :   constants.responseFlags.PARAMETER_MISSING,
        message   :   'Few parameters are missing.'
    };
    res.status(401);
    res.send(response);
}
