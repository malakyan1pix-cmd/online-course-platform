const express = require('express');
const lessonController = require('../controllers/lesson.controller');
const {
    authenticate,
    authorize
} = require('../middlewares/auth.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

router.get(
    '/courses/:courseId/lessons',
    authenticate,
    authorize(ROLES.INSTRUCTOR, ROLES.STUDENT, ROLES.ADMIN),
    lessonController.getLessonsByCourse
);

router.get(
    '/:id',
    authenticate,
    authorize(ROLES.INSTRUCTOR, ROLES.STUDENT, ROLES.ADMIN),
    lessonController.getLessonById
);

router.post(
    '/courses/:courseId/lessons',
    authenticate,
    authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
    lessonController.createLesson
);

router.put(
    '/:id',
    authenticate,
    authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
    lessonController.updateLesson
);

router.delete(
    '/:id',
    authenticate,
    authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
    lessonController.deleteLesson
);

module.exports = router;