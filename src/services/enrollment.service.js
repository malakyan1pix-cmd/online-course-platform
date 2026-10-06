const { Enrollment, Course, User } = require('../models');
const { Op } = require('sequelize');

const ENROLLMENT_ERRORS = require('../constants/errors/enrollment.errors');
const COURSE_ERRORS = require('../constants/errors/course.errors');
const AppError = require('../utils/AppError');
const ROLES = require('../constants/roles');

const createEnrollment = async (courseId, currentUserId) => {
    const course = await Course.findByPk(courseId);

    if (!course) {
        throw new AppError(
            COURSE_ERRORS.NOT_FOUND.message,
            COURSE_ERRORS.NOT_FOUND.statusCode
        );
    }

    if (!course.isPublished) {
        throw new AppError(
            COURSE_ERRORS.NOT_PUBLISHED.message,
            COURSE_ERRORS.NOT_PUBLISHED.statusCode
        );
    }

    if (Number(course.instructorId) === Number(currentUserId)) {
        throw new AppError(
            ENROLLMENT_ERRORS.OWN_COURSE.message,
            ENROLLMENT_ERRORS.OWN_COURSE.statusCode
        );
    }

    const existingEnrollment = await Enrollment.findOne({
        where: {
            userId: currentUserId,
            courseId
        }
    });

    if (existingEnrollment) {
        throw new AppError(
            ENROLLMENT_ERRORS.ALREADY_ENROLLED.message,
            ENROLLMENT_ERRORS.ALREADY_ENROLLED.statusCode
        );
    }

    const enrollment = await Enrollment.create({
        userId: currentUserId,
        courseId,
        status: 'active',
        progress: 0
    });

    return enrollment;
};

const getMyEnrollments = async (currentUserId) => {
    const enrollments = await Enrollment.findAll({
        where: {
            userId: currentUserId
        },
        include: [
            {
                model: Course,
                include: [
                    {
                        model: User,
                        as: 'instructor',
                        attributes: ['id', 'fullName', 'email']
                    }
                ]
            }
        ],
        order: [['id', 'ASC']]
    });

    return enrollments;
};

const updateProgress = async (
    enrollmentId,
    progress,
    currentUserId
) => {
    const enrollment = await Enrollment.findByPk(enrollmentId);

    if (!enrollment) {
        throw new AppError(
            ENROLLMENT_ERRORS.NOT_FOUND.message,
            ENROLLMENT_ERRORS.NOT_FOUND.statusCode
        );
    }

    if (Number(enrollment.userId) !== Number(currentUserId)) {
        throw new AppError(
            ENROLLMENT_ERRORS.NOT_OWNER.message,
            ENROLLMENT_ERRORS.NOT_OWNER.statusCode
        );
    }

    if (enrollment.status === 'cancelled') {
        throw new AppError(
            ENROLLMENT_ERRORS.CANCELLED.message,
            ENROLLMENT_ERRORS.CANCELLED.statusCode
        ); 
    }

    const newProgress = Number(progress);

    if (
        !Number.isInteger(newProgress) || 
        newProgress < 0 || 
        newProgress > 100
    ) {
        throw new AppError(
            ENROLLMENT_ERRORS.INVALID_PROGRESS.message,
            ENROLLMENT_ERRORS.INVALID_PROGRESS.statusCode
        );
    }

    const newStatus = newProgress === 100 ? 'completed' : 'active';

    await enrollment.update({
        progress: newProgress,
        status: newStatus
    });

    return enrollment;
};

const deleteEnrollment = async (
    enrollmentId,
    currentUserId,
    currentUserRole
) => {
    const enrollment = await Enrollment.findByPk(enrollmentId);

    if (!enrollment) {
        throw new AppError(
            ENROLLMENT_ERRORS.NOT_FOUND.message,
            ENROLLMENT_ERRORS.NOT_FOUND.statusCode
        );
    }

    if (
        currentUserRole !== ROLES.ADMIN &&
        Number(enrollment.userId) !== Number(currentUserId)
    ) {
        throw new AppError(
            ENROLLMENT_ERRORS.NOT_OWNER.message,
            ENROLLMENT_ERRORS.NOT_OWNER.statusCode
        );
    }

    await enrollment.update({
        status: 'cancelled'
    });
    return enrollment;
};

const getAllEnrollments = async () => {
    const enrollments = await Enrollment.findAll({
        include: [
            {
                model: User,
                attributes: ['id', 'fullName', 'email']
            },
            {
                model: Course,
                include: [
                    {
                        model: User,
                        as: 'instructor',
                        attributes: ['id', 'fullName', 'email']
                    }
                ]
            }
        ],
        order: [['id', 'ASC']]
    });

    return enrollments;
};

module.exports = {
    createEnrollment,
    getMyEnrollments,
    updateProgress,
    deleteEnrollment,
    getAllEnrollments
};