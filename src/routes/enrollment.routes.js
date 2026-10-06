const express = require('express');
const enrollmentController = require('../controllers/enrollment.controller');
const {
    authenticate,
    authorize
} = require('../middlewares/auth.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

router.post(
    '/',
    authenticate,
    authorize(ROLES.STUDENT),
    enrollmentController.createEnrollment
);

router.get(
    '/me',
    authenticate,
    authorize(ROLES.STUDENT),
    enrollmentController.getMyEnrollments
);

router.patch(
    '/:id/progress',
    authenticate,
    authorize(ROLES.STUDENT),
    enrollmentController.updateProgress
);

router.delete(
    '/:id',
    authenticate,
    authorize(ROLES.STUDENT, ROLES.ADMIN),
    enrollmentController.deleteEnrollment
);

router.get(
    '/',
    authenticate,
    authorize(ROLES.ADMIN),
    enrollmentController.getAllEnrollments
);

module.exports = router;