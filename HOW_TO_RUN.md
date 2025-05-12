# How to Run the Integrated Website

This project integrates both student dashboard and teacher dashboard into a single application. Follow these steps to run the application:

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (connection string is already set up in .env file)

## Step 1: Start the Backend Server

1. Open a terminal and navigate to the backend directory:
```
cd integrated-website/backend
```

2. Install dependencies:
```
npm install
```

3. Start the server:
```
npm start
```

The backend server will start running on port 5000.

## Step 2: Start the Frontend Application

1. Open another terminal and navigate to the frontend directory:
```
cd integrated-website/frontend
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

The frontend application will start running on port 3000.

## Step 3: Access the Application

Open your browser and visit:
```
http://localhost:3000
```

## Features

The integrated application includes:

### Student Features:
- Student registration and login
- Browse tutors based on subject and language
- Book classes with tutors
- View scheduled classes on calendar
- Track class attendance and progress

### Teacher Features:
- Teacher registration and login
- Dashboard with statistics (class and views)
- Video management for uploading teaching materials
- Subject management
- Course management

## User Flows

### Student Flow:
1. Register or Login as a student
2. Browse available tutors
3. Book a class with a tutor
4. View scheduled classes on the calendar

### Teacher Flow:
1. Register or Login as a teacher
2. View dashboard with statistics
3. Upload teaching videos
4. Manage subjects and courses
5. Track student attendance and class performance

## API Documentation

The backend provides the following API endpoints:

### Student APIs:
- POST /api/student/register - Register new student
- POST /api/student/login - Student login
- GET /api/student/profile - Get student profile
- POST /api/student/search-tutors - Search for tutors
- POST /api/student/book-class - Book a class

### Teacher APIs:
- POST /api/tutor/register - Register new teacher
- POST /api/tutor/login - Teacher login
- POST /api/tutor/videos - Upload video
- GET /api/tutor/class-statistics - Get class statistics
- GET /api/tutor/views-statistics - Get views statistics

This integrated application provides a seamless experience for both students and teachers on a single platform.
