const enrollmentService = require('../services/enrollment.service');
const asyncHandler = require('../utils/asyncHandler');

const createEnrollment = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.createEnrollment(
        req.body.courseId,
        req.user.id
    );

    res.status(201).json({
        success: true,
        data: {
            enrollment
        } 
    });
});

const getMyEnrollments = asyncHandler(async (req, res) => {
    const enrollments = await enrollmentService.getMyEnrollments(
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: {
            enrollments
        }
    });
});

const updateProgress = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.updateProgress(
        req.params.id,
        req.body.progress,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: {
            enrollment
        }
    });
});

const deleteEnrollment = asyncHandler(async (req, res) => {
    await enrollmentService.deleteEnrollment(
        req.params.id,
        req.user.id,
        req.user.role
    );

    res.status(200).json({
        success: true,
        data: {
            message: 'Enrollment cancelled successfully'
        }
    });
});

const getAllEnrollments = asyncHandler(async (req, res) => {
    const enrollments = await enrollmentService.getAllEnrollments();

    res.status(200).json({
        success: true,
        data: {
            enrollments
        }
    });
});

module.exports = {
    createEnrollment,
    getMyEnrollments,
    updateProgress,
    deleteEnrollment,
    getAllEnrollments
};