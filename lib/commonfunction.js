const  _                  = require('lodash');
const phone               = require("node-phonenumber");

const constants         = require('./constants');
const dbHandler         = require('../scripts/databaseHandler').dbHandler;
const config            = require('../config/config');

exports.checkBlank                      =   checkBlank;
exports.formatPhoneNumber               =   formatPhoneNumber;

// Check Null/Undefined/Empty field
function checkBlank(arr) {
  for(var i in arr){
   if(_.isNil(arr[i]) || arr[i].toString().trim() === ''){
     return 1;
   }
  }
  return 0;
}

function formatPhoneNumber(number) {
  var phoneUtil = phone.PhoneNumberUtil.getInstance();
  var phoneNumber = phoneUtil.parse(number.toString(), 'IN');
  return (phoneUtil.format(phoneNumber, phone.PhoneNumberFormat.E164).substring(3));
}
