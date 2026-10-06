module.exports = {
    NOT_FOUND: {
        message: 'Lesson not found',
        statusCode: 404
    },

    ORDER_EXISTS: {
        message: 'Lesson order already exists in this course',
        statusCode: 409
    },

    NOT_ENROLLED: {
        message: 'You are not enrolled in this course',
        statusCode: 403
    },

    INVALID_DURATION: {
        message: 'Duration must be greater than 0',
        statusCode: 400
    }
};