var myContext = this;

function define(obj, name, value) {
    Object.defineProperty(obj, name, {
        value: value,
        enumerable: true,
        writable: false,
        configurable: true
    });
}

exports.responseFlags = {};
//FOR FLAGS
define(exports.responseFlags, 'PARAMETER_MISSING', 100);
define(exports.responseFlags, 'USER_NOT_FOUND', 101);
define(exports.responseFlags, 'INVALID_ACCESS_TOKEN', 401);
define(exports.responseFlags, "UNAUTHORIZED_ACCESS",   103);
define(exports.responseFlags, "INCORRECT_PASSWORD", 108);
define(exports.responseFlags, 'ACTION_FAILED', 121);
define(exports.responseFlags, 'ACTION_COMPLETE', 200);


exports.userStatus = {};
define(exports.userStatus, "SELF", 1);
define(exports.userStatus, "CORPORATE", 2);
define(exports.userStatus, "GROUP", 3);
define(exports.userStatus, "OTHERS", 4);
