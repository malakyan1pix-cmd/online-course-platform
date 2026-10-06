const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');

const getUsers = asyncHandler(async (req, res) => {
    const users = await userService.getUsers(req.query.role);

    res.status(200).json({
        success: true,
        data: {
            users
        }
    });
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);

    res.status(200).json({
        success: true,
        data: {
            user
        }
    });
});

const updateUserRole = asyncHandler(async (req, res) => {
    const user = await userService.updateUserRole(
        req.params.id,
        req.body.role,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: {
            user
        }
    });
});

const deleteUser = asyncHandler(async (req, res) => {
    await userService.deleteUser(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: {
            message: 'User deleted successfully'
        }
    });
 });

module.exports = {
    getUsers,
    getUserById,
    updateUserRole,
    deleteUser
};