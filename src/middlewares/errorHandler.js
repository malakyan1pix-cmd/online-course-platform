const {
    ValidationError,
    UniqueConstraintError,
    ForeignKeyConstraintError
} = require('sequelize');

const {
  JsonWebTokenError,
  TokenExpiredError,
} = require("jsonwebtoken");

const AppError = require('../utils/AppError');
const AUTH_ERRORS = require("../constants/errors/auth.errors");

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong';

    if (err instanceof AppError) {
        return res.status(statusCode).json({
            success: false,
            statusCode,
            message
        });
    }

    if (err instanceof UniqueConstraintError) {
        statusCode = 409;
        message = err.message;

        return res.status(statusCode).json({
            success: false,
            statusCode,
            message
        });
    }

    if (err instanceof ValidationError) {
        statusCode = 400;
        message= err.message;

        return res.status(statusCode).json({
            success: false,
            statusCode,
            message
        });
    }

    if (err instanceof ForeignKeyConstraintError) {
        statusCode = 400;
        message = err.message;

        return res.status(statusCode).json({
            success: false,
            statusCode,
            message
        });
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = AUTH_ERRORS.TOKEN_EXPIRED.message;
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = AUTH_ERRORS.TOKEN_INVALID.message;
    }

    if (statusCode === 500) {
        console.error(err);
        message = 'Something went wrong';
    }

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
};

module.exports = errorHandler;