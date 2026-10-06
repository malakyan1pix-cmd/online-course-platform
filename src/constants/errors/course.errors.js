module.exports = {
    NOT_FOUND: {
        message: 'Course not found',
        statusCode: 404
    },

    NOT_OWNER: {
        message: 'You can only modify your own courses',
        statusCode: 403
    },

    NOT_PUBLISHED: {
        message: 'Course is not published yet',
        statusCode: 400
    },

    INVALID_PRICE: {
        message: 'Price must be 0 or greater',
        statusCode: 400
    }
};