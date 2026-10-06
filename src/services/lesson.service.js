const { Course, Lesson, Enrollment } = require('../models');
const { Op } = require('sequelize');

const COURSE_ERRORS = require('../constants/errors/course.errors');
const LESSON_ERRORS = require('../constants/errors/lesson.errors');
const AppError = require('../utils/AppError');
const ROLES = require('../constants/roles');

const getLessonsByCourse = async (
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

    if (currentUserRole === ROLES.ADMIN) {
        return Lesson.findAll({
            where: {
                courseId
            },
            order: [['order', 'ASC']]
        });
    }

    if (currentUserRole === ROLES.INSTRUCTOR) {
        if (Number(course.instructorId) !== Number(currentUserId)) {
            throw new AppError(
                LESSON_ERRORS.NOT_OWNER.message,
                LESSON_ERRORS.NOT_OWNER.statusCode
            );
        }

        return Lesson.findAll({
            where: {
                courseId
            },
            order: [['order', 'ASC']]
        });
    }

    const enrollment = await Enrollment.findOne({
        where: {
            userId: currentUserId,
            courseId,
            status: {
                [Op.in]: ['active', 'completed']
            }
        }
    });

    if (!enrollment) {
        throw new AppError(
            LESSON_ERRORS.NOT_ENROLLED.message,
            LESSON_ERRORS.NOT_ENROLLED.statusCode
        );
    }

    return Lesson.findAll({
        where: {
            courseId
        },
        order: [['order', 'ASC']]
    });
};

const getLessonById = async (
    lessonId,
    currentUserId,
    currentUserRole
) => {
    const lesson = await Lesson.findByPk(lessonId, {
        include: [
            {
                model: Course,
                as: 'course'
            }
        ]
    });

    if (!lesson) {
        throw new AppError(
            LESSON_ERRORS.NOT_FOUND.message,
            LESSON_ERRORS.NOT_FOUND.statusCode
        );
    }

    if (currentUserRole === ROLES.ADMIN) {
        return lesson;
    }

    if (currentUserRole === ROLES.INSTRUCTOR) {
        if (
            Number(lesson.course.instructorId) !== Number(currentUserId)
        ) {
            throw new AppError(
                LESSON_ERRORS.NOT_OWNER.message,
                LESSON_ERRORS.NOT_OWNER.statusCode
            );
        }
        return lesson;
    }

    const enrollment = await Enrollment.findOne({
        where: {
            userId: currentUserId,
            courseId: lesson.course.id,
            status: {
                [Op.in]: ['active', 'completed']
            }
        }
    });

    if (!enrollment) {
        throw new AppError(
            LESSON_ERRORS.NOT_ENROLLED.message,
            LESSON_ERRORS.NOT_ENROLLED.statusCode
        );
    }

    return lesson;
};

const createLesson = async (
    courseId,
    lessonData,
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

    if (currentUserRole === ROLES.INSTRUCTOR) {
        if (Number(course.instructorId) !== Number(currentUserId)) {
            throw new AppError(
                LESSON_ERRORS.NOT_OWNER.message,
                LESSON_ERRORS.NOT_OWNER.statusCode
            );
        }
    }

    const duration = Number(lessonData.duration); 

    if (!Number.isInteger(duration) || duration <= 0) {
        throw new AppError(
            LESSON_ERRORS.INVALID_DURATION.message,
            LESSON_ERRORS.INVALID_DURATION.statusCode
        );
    }

    const existingLesson = await Lesson.findOne({
        where: {
            courseId,
            order: lessonData.order
        }
    });

    if (existingLesson) {
        throw new AppError(
            LESSON_ERRORS.ORDER_EXISTS.message,
            LESSON_ERRORS.ORDER_EXISTS.statusCode
        );
    }

    const lesson = await Lesson.create({
        title: lessonData.title,
        content: lessonData.content,
        videoUrl: lessonData.videoUrl,
        duration,
        order: lessonData.order,
        courseId
    });

    return lesson;
};

const updateLesson = async (
    lessonId,
    lessonData,
    currentUserId,
    currentUserRole
) => {
    const lesson = await Lesson.findByPk(lessonId, {
        include: [
            {
                model: Course,
                as: 'course'
            }
        ]
    });

    if (!lesson) {
        throw new AppError(
            LESSON_ERRORS.NOT_FOUND.message,
            LESSON_ERRORS.NOT_FOUND.statusCode
        );
    }

    if (currentUserRole === ROLES.INSTRUCTOR) {
        if (Number(lesson.course.instructorId) !== Number(currentUserId)) {
            throw new AppError(
                LESSON_ERRORS.NOT_OWNER.message,
                LESSON_ERRORS.NOT_OWNER.statusCode
            );
        }
    }

    if (lessonData.duration !== undefined) {
        const duration = Number(lessonData.duration);

        if (!Number.isFinite(duration) || duration <= 0) {
            throw new AppError(
                LESSON_ERRORS.INVALID_DURATION.message,
                LESSON_ERRORS.INVALID_DURATION.statusCode
            );
        }

        lessonData.duration = duration;
    }

    if (lessonData.order !== undefined) {
        const existingLesson = await Lesson.findOne({
            where: {
                courseId: lesson.course.id,
                order: lessonData.order,
                id: {
                    [Op.ne]: lessonId
                }
            }
        });

        if (existingLesson) {
            throw new AppError(
                LESSON_ERRORS.ORDER_EXISTS.message,
                LESSON_ERRORS.ORDER_EXISTS.statusCode
            );
        }
    }

    const allowedFields = [
        'title',
        'content',
        'videoUrl',
        'duration',
        'order'
    ];

    const updateData = {};

    for (const field of allowedFields) {
        if (lessonData[field] !== undefined) {
            updateData[field] = lessonData[field];
        }
    }

    await lesson.update(updateData);
    return lesson;
};

const deleteLesson = async (
    lessonId,
    currentUserId,
    currentUserRole
) => {
    const lesson = await Lesson.findByPk(lessonId, {
        include: [
            {
                model: Course,
                as: 'course'
            }
        ]
    });

    if (!lesson) {
        throw new AppError(
            LESSON_ERRORS.NOT_FOUND.message,
            LESSON_ERRORS.NOT_FOUND.statusCode
        );
    }

    if (currentUserRole === ROLES.INSTRUCTOR) {
        if (Number(lesson.course.instructorId) !== Number(currentUserId)) {
            throw new AppError(
                LESSON_ERRORS.NOT_OWNER.message,
                LESSON_ERRORS.NOT_OWNER.statusCode
            );
        }
    }

    await lesson.destroy();
};

module.exports = {
    getLessonsByCourse,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson
};