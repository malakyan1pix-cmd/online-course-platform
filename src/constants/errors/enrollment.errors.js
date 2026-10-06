module.exports = {
    CANCELLED: {
        message: 'Cannot update progress for a cancelled enrollment',
        statusCode: 400
    },

    NOT_FOUND: {
        message: 'Enrollment not found',
        statusCode: 404
    },

    ALREADY_ENROLLED: {
        message: 'You are already enrolled in this course',
        statusCode: 409
    },

    OWN_COURSE: {
        message: 'You cannot enroll in your own course',
        statusCode: 400
    },

    INVALID_PROGRESS: {
        message: 'Progress must be between 0 and 100',
        statusCode: 400
    },

    NOT_OWNER: {
        message: 'You can only modify your own enrollment',
        statusCode: 403
    }
};