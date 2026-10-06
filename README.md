# Online Course Platform REST API

REST API backend for an online course platform built with Node.js, Express and Sequelize.

The platform supports three types of users: **admin, instructor and student**.

* Instructors can create and manage their own courses and lessons.
* Students can browse published courses, enroll in courses and track their progress.
* Admins can manage users, courses, lessons and enrollments.

## Technologies

* Node.js
* Express.js
* Sequelize
* PostgreSQL
* JWT
* bcryptjs
* dotenv
* nodemon

## Project Structure

```text
src/
├── config/
├── constants/
├── models/
├── routes/
├── controllers/
├── services/
├── middlewares/
├── utils/
├── app.js
└── server.js
```

The project follows a layered architecture:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
Database
```

### Responsibilities

* **Routes** — define URLs and HTTP methods.
* **Middlewares** — authentication, authorization and validation.
* **Controllers** — receive requests and return responses.
* **Services** — contain business logic and database queries.
* **Models** — define database tables, validations and relationships.
* **Config** — database and environment configuration.
* **Constants** — roles and error messages.
* **Utils** — reusable helpers such as JWT, AppError and asyncHandler.

Controllers do not contain Sequelize queries. Business logic is handled in services.

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env` file in the project root.

Example:

```env
PORT=4000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=online_course_platform
DB_USER=postgres
DB_PASSWORD=your_password
DB_DIALECT=postgres

JWT_SECRET=your_secret
JWT_EXPIRES_IN=2h
```

## Running the Project

Development mode:

```bash
npm run dev
```

Production/start mode:

```bash
npm start
```

The server connects to PostgreSQL, synchronizes the models and starts only if the database connection is successful.

## Database

The project uses PostgreSQL and Sequelize.

The main entities are:

* User
* Course
* Lesson
* Enrollment

### Relationships

```text
User 1 ──── * Course
Course 1 ── * Lesson
User * ──── * Course
          Enrollment
```

Courses belong to instructors, courses contain lessons, and students enroll in courses through the Enrollment table.

## Authentication and Authorization

The API uses JWT authentication.

There are three roles:

### Admin

Can manage users and all courses, lessons and enrollments.

### Instructor

Can:

* create courses;
* update and delete their own courses;
* create, update and delete lessons in their own courses;
* view students enrolled in their courses.

### Student

Can:

* view published courses;
* enroll in courses;
* cancel enrollments;
* view their enrollments;
* view lessons of enrolled courses;
* update learning progress.

Users are registered as `student` by default. Only an admin can change a user's role.

## API Endpoints

All API routes start with `/api`.

### Authentication

| Method | Endpoint         | Access        |
| ------ | ---------------- | ------------- |
| POST   | `/auth/register` | Public        |
| POST   | `/auth/login`    | Public        |
| GET    | `/auth/me`       | Authenticated |

### Users

| Method | Endpoint          | Access |
| ------ | ----------------- | ------ |
| GET    | `/users`          | Admin  |
| GET    | `/users/:id`      | Admin  |
| PATCH  | `/users/:id/role` | Admin  |
| DELETE | `/users/:id`      | Admin  |

### Courses

| Method | Endpoint                | Access             |
| ------ | ----------------------- | ------------------ |
| GET    | `/courses`              | Public             |
| GET    | `/courses/my`           | Instructor         |
| GET    | `/courses/:id`          | Public             |
| POST   | `/courses`              | Instructor / Admin |
| PUT    | `/courses/:id`          | Owner / Admin      |
| DELETE | `/courses/:id`          | Owner / Admin      |
| GET    | `/courses/:id/students` | Owner / Admin      |

Courses can be filtered by:

```text
GET /courses?category=Programming
GET /courses?level=beginner
```

### Lessons

| Method | Endpoint                     | Access                           |
| ------ | ---------------------------- | -------------------------------- |
| GET    | `/courses/:courseId/lessons` | Enrolled Student / Owner / Admin |
| GET    | `/lessons/:id`               | Enrolled Student / Owner / Admin |
| POST   | `/courses/:courseId/lessons` | Owner / Admin                    |
| PUT    | `/lessons/:id`               | Owner / Admin                    |
| DELETE | `/lessons/:id`               | Owner / Admin                    |

### Enrollments

| Method | Endpoint                    | Access        |
| ------ | --------------------------- | ------------- |
| POST   | `/enrollments`              | Student       |
| GET    | `/enrollments/me`           | Student       |
| PATCH  | `/enrollments/:id/progress` | Student       |
| DELETE | `/enrollments/:id`          | Owner / Admin |
| GET    | `/enrollments`              | Admin         |

## Business Rules

* Registration always creates a student account.
* Students can enroll only in published courses.
* A student cannot enroll in the same course twice.
* An instructor cannot enroll in their own course.
* Instructors can modify only their own courses.
* Students can access lessons only when they have an active or completed enrollment.
* Lesson order must be unique within a course.
* Progress must be between 0 and 100.
* When progress reaches 100%, enrollment status becomes `completed`.
* Cancelled enrollments cannot update progress.
* An admin cannot delete their own account or change their own role.
* Unpublished courses are visible only to their owner and admins.

## Error Handling

The project uses a global error handler and a custom `AppError` class.

Successful responses use:

```json
{
  "success": true,
  "data": {}
}
```

Error responses use:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Course not found"
}
```

The API handles validation, duplicate data, foreign key errors and JWT errors centrally.

## Database Synchronization

The server uses Sequelize to synchronize the database models.

`sync({ force: true })` is dangerous because it drops existing tables before recreating them. This can permanently delete all existing data.

Therefore, `force: true` should never be used on a production database.

## Environment Variables

The `.env` file contains sensitive configuration and must not be committed to GitHub.

The repository contains `.env.example` with the required environment variable names.

## Author

Online Course Platform — Final Backend Project
