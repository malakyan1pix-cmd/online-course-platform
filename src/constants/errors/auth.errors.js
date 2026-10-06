module.exports = {
    INVALID_CREDENTIALS: {
        message: 'Invalid email or password',
        statusCode: 401
    },

    TOKEN_MISSING: {
        message: 'Authentication token is missing',
        statusCode: 401
    },

    TOKEN_INVALID: {
        message: 'Invalid authentication token',
        statusCode: 401
    },

    TOKEN_EXPIRED: {
        message: 'Authentication token has expired',
        statusCode: 401
    },

    FORBIDDEN: {
        message: 'You do not have permission to perform this action',
        statusCode: 403
    }
};