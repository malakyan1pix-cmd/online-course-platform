const bcrypt = require('bcryptjs');
const { User } = require('../models');
const ROLES = require('../constants/roles');
const AppError = require('../utils/AppError');
const AUTH_ERRORS = require('../constants/errors/auth.errors');
const { generateToken } = require('../utils/jwt');
const USER_ERRORS = require('../constants/errors/user.errors');

const register = async ({ fullName, email, password }) => {
    const existingUser = await User.findOne({
        where: { email }
    });

    if (existingUser) {
        throw new AppError(
            USER_ERRORS.EMAIL_EXISTS.message,
            USER_ERRORS.EMAIL_EXISTS.statusCode
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: ROLES.STUDENT
    });

    const userData = user.toJSON();
    delete userData.password;

    return userData;
};

const login = async ({ email, password }) => {
    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        throw new AppError(
            AUTH_ERRORS.INVALID_CREDENTIALS.message,
            AUTH_ERRORS.INVALID_CREDENTIALS.statusCode
        );
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new AppError(
            AUTH_ERRORS.INVALID_CREDENTIALS.message,
            AUTH_ERRORS.INVALID_CREDENTIALS.statusCode
        );
    }

    const token = generateToken(user);

    const userData = user.toJSON();
    delete userData.password;

    return {
        token,
        user: userData
    };
};

const getMe = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new AppError(
            USER_ERRORS.NOT_FOUND.message,
            USER_ERRORS.NOT_FOUND.statusCode
        );
    }

    const userData = user.toJSON();
    delete userData.password;

    return userData;
};

module.exports = {
    register,
    login,
    getMe
};
