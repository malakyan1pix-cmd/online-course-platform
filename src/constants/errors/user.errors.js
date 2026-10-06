module.exports = {
    NOT_FOUND: {
        message: 'User not found',
        statusCode: 404
    },

    EMAIL_EXISTS: {
        message: 'Email already exists',
        statusCode: 409
    },

    INVALID_ROLE: {
        message: 'Invalid role',
        statusCode: 400
    },

    CANNOT_DELETE_SELF: {
        message: 'You cannot delete yourself',
        statusCode: 400
    },

    CANNOT_CHANGE_OWN_ROLE: {
        message: 'You cannot change your own role',
        statusCode: 400
    }
};