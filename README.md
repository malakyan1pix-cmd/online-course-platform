# Online Course Platform

REST API backend for an online course platform built with Node.js, Express, Sequelize, PostgreSQL and JWT authentication.

## Technologies

* Node.js
* Express.js
* PostgreSQL
* Sequelize ORM
* JWT
* bcryptjs
* dotenv
* nodemon

## Features

* User registration and login
* JWT authentication
* Role-based authorization
* Three user roles:

  * `admin`
  * `instructor`
  * `student`
* Course management
* Lesson management
* Course enrollment
* Enrollment progress tracking
* Course completion status
* Ownership checks
* Sequelize associations and JOIN queries
* Centralized error handling
* Database auto-creation and synchronization
* Seed data

## Project Structure

```text
src/
├── config/
├── constants/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
├── app.js
├── server.js
└── seed.js
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
PostgreSQL
```

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`.

Example:

```env
PORT=4000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=online_course_platform
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_DIALECT=postgres

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=2h
```

## Running the Project

Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:4000
```

API base URL:

```text
http://localhost:4000/api
```

The application automatically:

1. Checks whether the PostgreSQL database exists.
2. Creates the database if necessary.
3. Connects to PostgreSQL.
4. Synchronizes Sequelize models.
5. Starts the Express server.

### Why is `sync({ force: true })` dangerous?

`sequelize.sync({ force: true })` drops existing tables before recreating them.
This means all existing data in the database can be permanently deleted.
Therefore, it should never be used on a production database.

## Seed Data

To create sample users, courses and lessons:

```bash
npm run seed
```

Seed accounts:

| Role       | Email                    | Password |
| ---------- | ------------------------ | -------- |
| Admin      | `admin@example.com`      | `123456` |
| Instructor | `instructor@example.com` | `123456` |
| Student    | `student@example.com`    | `123456` |

## API Endpoints

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

| Method | Endpoint                | Access            |
| ------ | ----------------------- | ------------------|
| GET    | `/courses`              | Public            |
| GET    | `/courses/my`           | Instructor        |
| GET    | `/courses/:id`          | Public            |
| POST   | `/courses`              | Instructor/Admin  |
| PUT    | `/courses/:id`          | Owner/Admin       |
| DELETE | `/courses/:id`          | Owner/Admin       |
| GET    | `/courses/:id/students` | Owner/Admin       |

### Lessons

| Method | Endpoint                     | Access                           |
| ------ | ---------------------------- | -------------------------------- |
| GET    | `/courses/:courseId/lessons` | Enrolled Student / Owner / Admin |
| GET    | `/lessons/:id`               | Authorized                       |
| POST   | `/courses/:courseId/lessons` | Owner / Admin                    |
| PUT    | `/lessons/:id`               | Owner / Admin                    |
| DELETE | `/lessons/:id`               | Owner / Admin                    |

### Enrollments

| Method | Endpoint                    | Access           |
| ------ | --------------------------- | ---------------- |
| POST   | `/enrollments`              | Student          |
| GET    | `/enrollments/me`           | Student          |
| PATCH  | `/enrollments/:id/progress` | Enrollment Owner |
| DELETE | `/enrollments/:id`          | Owner / Admin    |
| GET    | `/enrollments`              | Admin            |

## Business Rules

* Only published courses can be enrolled in.
* A student cannot enroll in the same course twice.
* An instructor cannot enroll in their own course.
* Students can access lessons only when enrolled.
* Course owners and admins can access their course lessons.
* Lesson order must be unique within a course.
* Enrollment progress must be between `0` and `100`.
* Progress `100` changes enrollment status to `completed`.
* Cancelled enrollments cannot be updated.
* Admin cannot change their own role.
* Admin cannot delete their own account.
* Unpublished courses are visible to their owner and admins.

## Error Handling

The API uses a consistent error response format:

```json
{
  "success": false,
  "statusCode": 409,
  "message": "You are already enrolled in this course"
}
```

Successful responses use:

```json
{
  "success": true,
  "data": {}
}
```

## Authentication

Protected endpoints require a JWT access token:

```text
Authorization: Bearer <token>
```

Passwords are hashed using `bcryptjs` and are never returned in API responses.

## Database Relationships

```text
User
 ├── Courses (as instructor)
 ├── Enrolled Courses
 │     └── Enrollment
 │
Course
 ├── Instructor (User)
 ├── Lessons
 └── Students (through Enrollment)

Enrollment
 ├── User
 └── Course
```

## Postman

A Postman collection is included with the project and contains the API requests for authentication, users, courses, lessons and enrollments.

Import the collection into Postman and configure the JWT token in the Authorization tab for protected requests.

## Author

Individual backend project for Web 2.3.
