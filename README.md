# Integrated Learning Platform

This project integrates both student dashboard and teacher dashboard functionalities into a single application.

## Recent Improvements (May 12, 2025)

### Demo Account Access
- Added demo student and tutor accounts for easy testing
- Created a TestLogin component at `/test-login` route to verify login functionality
- Demo credentials:
  - Student: `demo_student` / `password123`
  - Tutor: `demo_tutor` / `password123`

### React Hook Fixes
- Fixed "Rendered fewer hooks than expected" errors
- Addressed rules-of-hooks violations in components
- Improved conditional rendering patterns

### Quick Start
- Added `start-app.bat` script for easy application startup
- Enhanced documentation with HOW_TO_LOGIN.md and HOW_TO_RUN.md

## Project Structure

```
integrated-website/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── utils/
    └── package.json
```

## Features

- Student Registration and Login
- Teacher Registration and Login
- Student Dashboard
- Teacher Dashboard
- Class Scheduling
- Course Management
- Video Uploads for Teachers
- Class Registration for Students
- Student Calendar

## Setup Instructions

### Prerequisites
- Node.js (v16 or above)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd integrated-website/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content (replace with your actual MongoDB URI):
   ```
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd integrated-website/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`

2. You can register as either a student or a tutor:
   - Student Registration: Click on "Student Register" in the navigation bar
   - Tutor Registration: Click on "Tutor Register" in the navigation bar

3. After registration, you can log in with your credentials:
   - Student Login: Use the "Student Login" link
   - Tutor Login: Use the "Tutor Login" link

4. Based on your role, you'll be directed to the appropriate dashboard:
   - Students: Can search for tutors, book classes, and view their class calendar
   - Tutors: Can manage their courses, upload videos, and view statistics

## API Endpoints

### Student APIs
- `POST /api/student/register` - Register a new student
- `POST /api/student/login` - Student login
- `GET /api/student/profile` - Get student profile
- `POST /api/student/search-tutors` - Search for tutors
- `POST /api/student/book-class` - Book a class
- `GET /api/student/registered-classes/:studentId` - Get student's registered classes

### Tutor APIs
- `POST /api/tutor/register` - Register a new tutor
- `POST /api/tutor/login` - Tutor login
- `POST /api/tutor/videos` - Upload a video
- `POST /api/tutor/subjects` - Add/update subjects
- `GET /api/tutor/class-statistics` - Get class statistics
- `GET /api/tutor/views-statistics` - Get views statistics

### Course APIs
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create a new course
- `GET /api/courses/:id` - Get a specific course
- `PUT /api/courses/:id` - Update a course
- `DELETE /api/courses/:id` - Delete a course
- `GET /api/courses/tutor/:tutorId` - Get courses by tutor
- `GET /api/courses/language/:language` - Get courses by language
