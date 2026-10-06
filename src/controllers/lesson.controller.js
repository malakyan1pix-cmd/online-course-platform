const lessonService = require('../services/lesson.service');
const asyncHandler = require('../utils/asyncHandler');

const getLessonsByCourse = asyncHandler(async (req, res) => {
    const lessons = await lessonService.getLessonsByCourse(
        req.params.courseId,
        req.user.id,
        req.user.role
    );

    res.status(200).json({
        success: true,
        data: {
            lessons
        }
    });
});

const getLessonById = asyncHandler(async (req, res) => {
    const lesson = await lessonService.getLessonById(
        req.params.id,
        req.user.id,
        req.user.role
    );

    res.status(200).json({
        success: true,
        data: {
            lesson
        }
    });
});

const createLesson = asyncHandler(async (req, res) => {
    const lesson = await lessonService.createLesson(
        req.params.courseId,
        req.body,
        req.user.id,
        req.user.role
    );

    res.status(201).json({
        success: true,
        data: {
            lesson
        }
    });
});

const updateLesson = asyncHandler(async (req, res) => {
    const lesson = await lessonService.updateLesson(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
    );

    res.status(200).json({
        success: true,
        data: {
            lesson
        }
    });
});

const deleteLesson = asyncHandler(async (req, res) => {
    await lessonService.deleteLesson(
        req.params.id,
        req.user.id,
        req.user.role
    );

    res.status(200).json({
        success: true,
        data: {
            message: 'Lesson deleted successfully'
        }
    });
});

module.exports = {
    getLessonsByCourse,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson
};