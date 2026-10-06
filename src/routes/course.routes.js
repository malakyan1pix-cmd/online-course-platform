const express = require('express');
const courseController = require('../controllers/course.controller');
const { 
    authenticate, 
    authorize, 
    optionalAuthenticate 
} = require('../middlewares/auth.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

router.get(
    '/',
    courseController.getCourses
);

router.get(
    '/my',
    authenticate,
    authorize(ROLES.INSTRUCTOR),
    courseController.getMyCourses
);

router.get(
    '/:id/students',
    authenticate,
    authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
    courseController.getCourseStudents
);

router.get(
    '/:id',
    optionalAuthenticate,
    courseController.getCourseById
);

router.post(
    '/',
    authenticate,
    authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
    courseController.createCourse
);

router.put(
    '/:id',
    authenticate,
    authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
    courseController.updateCourse
);

router.delete(
    '/:id',
    authenticate,
    authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
    courseController.deleteCourse
);

module.exports = router;