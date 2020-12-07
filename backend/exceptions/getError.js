const errorType = require( './errorTypes' )

const getError = errorName => {
    return errorType.ERROR_TYPES[ errorName ]
}

module.exports = getError