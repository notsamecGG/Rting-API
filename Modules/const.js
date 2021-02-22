exports.TOKEN_ACTIONS = {
    REPEAT: 0,
    RESTART: 1
};

exports.STATUSES = {
    FAILED: 0,
    SUCCESS: 1
}

exports.COOKIES = {
    DATA: 'data',
    TOKEN: 'token'
}

function ErrorWCode(message, code) {
    var error = new Error(message);
    error.code = code.toString(10);
    return error;
}

exports.ERRORS = {
    EMAIL_USED: ErrorWCode('Email is already used', 100),
    USERNAME_USED: ErrorWCode('Username is already used', 101),
    BAD_ENTRY: ErrorWCode("Username or password isn't correct", 102),
    COOKIES_NOT_AVIABLE: ErrorWCode("Cookies aren't aviable", 103)
}