const { User } = require('../models');
const ROLES = require('../constants/roles');
const USER_ERRORS = require('../constants/errors/user.errors');
const AppError = require('../utils/AppError');

const getUsers = async (role) => {
    const where = {};

    if (role) {
        where.role = role;
    }

    const users = await User.findAll({
        where,
        attributes: {
            exclude: ['password']
        },
        order: [['id', 'ASC']]
    });

    return users;
};

const getUserById = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: {
            exclude: ['password']
        }
    });

    if (!user) {
        throw new AppError(
            USER_ERRORS.NOT_FOUND.message,
            USER_ERRORS.NOT_FOUND.statusCode
        );
    }

    if (user.role === ROLES.INSTRUCTOR) {
        return User.findByPk(userId, {
            attributes: {
                exclude: ['password']
            },
            include: [
                {
                    association: 'courses'
                }
            ]
        });
    }

    if (user.role === ROLES.STUDENT) {
        return User.findByPk(userId, {
            attributes: {
                exclude: ['password']
            },
            include: [
                {
                    association: 'enrolledCourses'
                }
            ]
        });
    }
    return user;
};

const updateUserRole = async (userId, role, currentUserId) => {
    if (!Object.values(ROLES).includes(role)) {
        throw new AppError(
            USER_ERRORS.INVALID_ROLE.message,
            USER_ERRORS.INVALID_ROLE.statusCode
        );
    }

    if (Number(userId) === Number(currentUserId)) {
        throw new AppError(
            USER_ERRORS.CANNOT_CHANGE_OWN_ROLE.message,
            USER_ERRORS.CANNOT_CHANGE_OWN_ROLE.statusCode
        );
    }

    const user = await User.findByPk(userId);

    if (!user) {
        throw new AppError(
            USER_ERRORS.NOT_FOUND.message,
            USER_ERRORS.NOT_FOUND.statusCode
        );
    }

    user.role = role;
    await user.save();

    const userData = user.toJSON();
    delete userData.password;

    return userData;
};

const deleteUser = async (userId, currentUserId) => {
    if (Number(userId) === Number(currentUserId)) {
        throw new AppError(
            USER_ERRORS.CANNOT_DELETE_SELF.message,
            USER_ERRORS.CANNOT_DELETE_SELF.statusCode
        );
    }

    const user = await User.findByPk(userId);

    if (!user) {
        throw new AppError(
            USER_ERRORS.NOT_FOUND.message,
            USER_ERRORS.NOT_FOUND.statusCode
        );
    }

    await user.destroy();
};

module.exports = {
    getUsers,
    getUserById,
    updateUserRole,
    deleteUser
}