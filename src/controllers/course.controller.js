const courseService = require('../services/course.service');
const asyncHandler = require('../utils/asyncHandler');

const getCourses = asyncHandler(async (req, res) => {
    const courses = await courseService.getCourses(
        req.query.category,
        req.query.level
    );

    res.status(200).json({
        success: true,
        data: {
            courses
        }
    });
});

const getMyCourses = asyncHandler(async (req, res) => {
    const courses = await courseService.getMyCourses(
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: {
            courses
        }
    });
});

const getCourseById = asyncHandler(async (req, res) => {
    const course = await courseService.getCourseById(
        req.params.id,
        req.user?.id,
        req.user?.role
    );

    res.status(200).json({
        success: true,
        data: {
            course
        }
    });
});

const createCourse = asyncHandler(async (req, res) => {
    const course = await courseService.createCourse(
        req.body,
        req.user.id
    );

    res.status(201).json({
        success: true,
        data: {
            course
        }
    });
});

const updateCourse = asyncHandler(async (req, res) => {
    const course = await courseService.updateCourse(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
    );

    res.status(200).json({
        success: true,
        data: {
            course
        }
    });
});

const deleteCourse = asyncHandler(async (req, res) => {
    await courseService.deleteCourse(
        req.params.id,
        req.user.id,
        req.user.role
    );

    res.status(200).json({
        success: true,
        data: {
            message: 'Course deleted successfully'
        }
    });
});

const getCourseStudents = asyncHandler(async (req, res) =>{
    const students = await courseService.getCourseStudents(
        req.params.id,
        req.user.id,
        req.user.role
    );

    res.status(200).json({
        success: true,
        data: {
            students
        }
    });
});


module.exports = {
    getCourses,
    getMyCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseStudents
};