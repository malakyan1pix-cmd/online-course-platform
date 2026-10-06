const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

router.get(
    '/', 
    authenticate, 
    authorize(ROLES.ADMIN), 
    userController.getUsers
);

router.get(
    '/:id',
    authenticate,
    authorize(ROLES.ADMIN),
    userController.getUserById
);

router.patch(
    '/:id/role',
    authenticate,
    authorize(ROLES.ADMIN),
    userController.updateUserRole
);

router.delete(
    '/:id',
    authenticate,
    authorize(ROLES.ADMIN),
    userController.deleteUser
);

module.exports = router;