const { User } = require('../models');
const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const AUTH_ERRORS = require('../constants/errors/auth.errors');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError(
                AUTH_ERRORS.TOKEN_MISSING.message,
                AUTH_ERRORS.TOKEN_MISSING.statusCode
            );
        }

        const token = authHeader.split(' ')[1];

        const decoded = verifyToken(token);

        const user = await User.findByPk(decoded.id);

        if (!user) {
            throw new AppError(
                AUTH_ERRORS.TOKEN_INVALID.message,
                AUTH_ERRORS.TOKEN_INVALID.statusCode
            );
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    AUTH_ERRORS.FORBIDDEN.message,
                    AUTH_ERRORS.FORBIDDEN.statusCode
                )
            );
        }
        next();
    };
};

const optionalAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next();
        }

        if (!authHeader.startsWith('Bearer ')) {
            throw new AppError(
                AUTH_ERRORS.TOKEN_INVALID.message,
                AUTH_ERRORS.TOKEN_INVALID.statusCode
            );
        }

        const token = authHeader.split(' ')[1];

        const decoded = verifyToken(token);

        const user = await User.findByPk(decoded.id);

        if (!user) {
            throw new AppError(
                AUTH_ERRORS.TOKEN_INVALID.message,
                AUTH_ERRORS.TOKEN_INVALID.statusCode
            );
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    authenticate,
    optionalAuthenticate,
    authorize
};