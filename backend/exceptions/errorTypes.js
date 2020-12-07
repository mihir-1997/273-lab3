const ERRORS = {
    NO_USER_FOUND: 'NO_USER_FOUND',
    WRONG_CREDENTIALS: 'WRONG_CREDENTIALS',
    USER_EXIST: 'USER_EXIST',
    INTERNAL_SERVER_EROR: 'INTERNAL_SERVER_EROR'
}

const ERROR_TYPES = {
    NO_USER_FOUND: {
        message: "No user found",
        statusCode: 404
    },
    WRONG_CREDENTIALS: {
        message: "Wrong credentials",
        statusCode: 401
    },
    USER_EXIST: {
        message: "User already exist",
        statusCode: 409
    },
    INTERNAL_SERVER_EROR: {
        message: "Interval server error",
        statusCode: 500
    }
}

module.exports = {
    ERRORS,
    ERROR_TYPES
}