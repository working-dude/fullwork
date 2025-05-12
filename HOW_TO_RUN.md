# How to Run the Integrated Website

This project integrates both student dashboard and teacher dashboard into a single application. Follow these steps to run the application:

## Quick Start (Windows)

We've added a quick start script to make it easier to launch both servers:

1. Double-click the `start-app.bat` file in the integrated-website folder
2. This will open two command prompts:
   - One running the backend server on port 5000
   - One running the frontend server on port 3000
3. Wait for both servers to start (you'll see confirmation messages)
4. The frontend should automatically open in your default browser

## Manual Setup

If you prefer to start the servers manually, follow the instructions below.

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

## Step 4: Use Demo Accounts

We've created demo accounts for both student and tutor roles:

### Student Demo Account:
- Username: demo_student
- Password: password123

### Tutor Demo Account:
- Username: demo_tutor
- Password: password123

### Quick Testing Option:
1. Navigate to: http://localhost:3000/test-login
2. Use the "Test Student Login" or "Test Tutor Login" buttons
3. This page will show you the results and verify if the login works correctly

For detailed login instructions, see the [HOW_TO_LOGIN.md](./HOW_TO_LOGIN.md) file.

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

## Troubleshooting

### Fixed Issues:

#### React Hook Errors:
We've resolved various React hook errors including:

1. **"Rendered fewer hooks than expected"** errors by:
   - Updating conditional rendering in components
   - Ensuring consistent hook calls in all render paths
   - Using proper patterns for React hooks

2. **"React Hook rules-of-hooks"** errors by:
   - Converting regular functions that use hooks into proper custom hooks
   - Following React's naming convention (custom hooks must start with "use")
   - Using hooks only at the top level of components or other hooks

If you still encounter React hook errors:
- Check the browser console for specific component errors
- Make sure you're running the latest code with the fixes
- Force refresh your browser (Ctrl+F5)

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
