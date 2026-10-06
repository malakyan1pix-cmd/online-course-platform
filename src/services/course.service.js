const { Course, User, Lesson } = require('../models');
const { fn, col } = require('sequelize');

const COURSE_ERRORS = require('../constants/errors/course.errors');
const AppError = require('../utils/AppError');
const ROLES = require('../constants/roles');

const getCourses = async (category, level) => {
    const where = {
        isPublished: true
    };

    if (category) {
        where.category = category;
    }

    if (level) {
        where.level = level;
    }

    const courses = await Course.findAll({
        where,

        attributes: {
            include: [
                [fn('COUNT', col('lessons.id')), 'lessonCount']
            ]
        },

        include: [
            {
                model: User,
                as: 'instructor',
                attributes: ['id', 'fullName', 'email']
            },
            {
                model: Lesson,
                as: 'lessons',
                attributes: []
            }
        ],

        group: [
            'Course.id',
            'instructor.id'
        ],

        order: [['id', 'ASC']]
    });

    return courses;
};

const getMyCourses = async (instructorId) => {
    const courses = await Course.findAll({
        where: {
            instructorId
        },
        include: [
            {
                model: User,
                as: 'instructor',
                attributes: ['id', 'fullName', 'email']
            },
            {
                model: Lesson,
                as: 'lessons',
                attributes: []
            }
        ],
        attributes: {
            include: [
                [fn('COUNT', col('lessons.id')), 'lessonCount']
            ]
        },
        group: [
            'Course.id',
            'instructor.id'
        ],
        order: [['id', 'ASC']]
    });

    return courses;
};

const getCourseById = async (courseId, currentUserId, currentUserRole) => {
    const course = await Course.findByPk(courseId, {
        include: [
            {
                model: User,
                as: 'instructor',
                attributes: ['id', 'fullName', 'email']
            },
            {
                model: Lesson,
                as: 'lessons',
                order: [['order', 'ASC']]
            }
        ]
    });

    if (!course) {
        throw new AppError(
            COURSE_ERRORS.NOT_FOUND.message,
            COURSE_ERRORS.NOT_FOUND.statusCode
        );
    }

    const isOwner = Number(course.instructorId) === Number(currentUserId);

    const isAdmin = currentUserRole === ROLES.ADMIN;

    if (!course.isPublished && !isOwner && !isAdmin) {
        throw new AppError(
            COURSE_ERRORS.NOT_PUBLISHED.message,
            COURSE_ERRORS.NOT_PUBLISHED.statusCode
        );
    }

    return course;
};

const createCourse = async (courseData, currentUserId) => {
    const {
        title,
        description,
        category,
        level,
        price,
        isPublished
    } = courseData;

    if (price !== undefined && Number(price) < 0) {
        throw new AppError(
            COURSE_ERRORS.INVALID_PRICE.message,
            COURSE_ERRORS.INVALID_PRICE.statusCode
        );
    }

    const course = await Course.create({
        title,
        description,
        category,
        level,
        price,
        isPublished,
        instructorId: currentUserId
    });

    return course;
};

const updateCourse = async (
    courseId,
    courseData,
    currentUserId,
    currentUserRole
) => {
    const course = await Course.findByPk(courseId);

    if (!course) {
        throw new AppError(
            COURSE_ERRORS.NOT_FOUND.message,
            COURSE_ERRORS.NOT_FOUND.statusCode
        );
    }

    const isOwner = Number(course.instructorId) === Number(currentUserId);

    const isAdmin = currentUserRole === ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
        throw new AppError(
            COURSE_ERRORS.NOT_OWNER.message,
            COURSE_ERRORS.NOT_OWNER.statusCode
        );
    }

    if (
        courseData.price !== undefined &&
        Number(courseData.price) < 0
    ) {
        throw new AppError(
            COURSE_ERRORS.INVALID_PRICE.message,
            COURSE_ERRORS.INVALID_PRICE.statusCode
        );
    }

    const allowedFields = [
        'title',
        'description',
        'category',
        'level',
        'price',
        'isPublished'
    ];

    const updateData = {};

    for (const field of allowedFields) {
        if (courseData[field] !== undefined) {
            updateData[field] = courseData[field];
        }
    }

    await course.update(updateData);
    return course;
};

const deleteCourse = async (
    courseId,
    currentUserId,
    currentUserRole
) => {
    const course = await Course.findByPk(courseId);

    if (!course) {
        throw new AppError(
            COURSE_ERRORS.NOT_FOUND.message,
            COURSE_ERRORS.NOT_FOUND.statusCode
        );
    }

    const isOwner = Number(course.instructorId) === Number(currentUserId);

    const isAdmin = currentUserRole === ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
        throw new AppError(
            COURSE_ERRORS.NOT_OWNER.message,
            COURSE_ERRORS.NOT_OWNER.statusCode
        );
    }

    await course.destroy();
};

const getCourseStudents = async (
    courseId,
    currentUserId,
    currentUserRole
) => {
    const course = await Course.findByPk(courseId);

    if (!course) {
        throw new AppError(
            COURSE_ERRORS.NOT_FOUND.message,
            COURSE_ERRORS.NOT_FOUND.statusCode
        );
    }

    const isOwner = Number(course.instructorId) === Number(currentUserId);

    const isAdmin = currentUserRole === ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
        throw new AppError(
            COURSE_ERRORS.NOT_OWNER.message,
            COURSE_ERRORS.NOT_OWNER.statusCode
        );
    }

    const students = await course.getStudents({
        attributes: ['id', 'fullName', 'email'],
        joinTableAttributes: ['status', 'progress']
    });

    return students;
}

module.exports = {
    getCourses,
    getMyCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseStudents
};