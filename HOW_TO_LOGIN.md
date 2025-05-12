# Demo Account Login Instructions

This document provides instructions for logging into the application using pre-created demo accounts for both student and tutor roles.

## Demo Accounts Ready! ✅
The demo accounts have been successfully created and tested. You can use them to log in to the application without needing to register.

## Important Note
Due to the API configuration in the frontend, make sure that:
1. Backend is running on port 5000
2. The frontend code has been updated to use `http://localhost:5000` as the API base URL
3. If you encounter login issues, check the browser's developer tools console for errors

## Demo Account Credentials

### Student Account
- **Username:** demo_student
- **Password:** password123

### Tutor Account
- **Username:** demo_tutor
- **Password:** password123

## Login Instructions

### Step 1: Start the Backend Server
1. Open a terminal/command prompt
2. Navigate to the backend directory:
   ```
   cd c:\Users\1887s\OneDrive\Desktop\kanishk\internship\full_gpt\integrated-website\backend
   ```
3. Start the server:
   ```
   npm start
   ```
4. You should see messages confirming the server is running on port 5000 and connected to MongoDB Atlas

### Step 2: Start the Frontend Application
1. Open another terminal/command prompt
2. Navigate to the frontend directory:
   ```
   cd c:\Users\1887s\OneDrive\Desktop\kanishk\internship\full_gpt\integrated-website\frontend
   ```
3. Start the frontend application:
   ```
   npm start
   ```
4. The application should open in your browser at http://localhost:3000

### Step 3: Login as Student
1. Navigate to the student login page
2. Enter the student credentials:
   - Username: demo_student
   - Password: password123
3. Click the Login button

### Step 4: Login as Tutor
1. Navigate to the tutor login page
2. Enter the tutor credentials:
   - Username: demo_tutor
   - Password: password123
3. Click the Login button

### Quick Option: Test Login Page
We've added a special test page to verify login functionality directly:
1. Navigate to: http://localhost:3000/test-login
2. Click on either "Test Student Login" or "Test Tutor Login" button
3. The page will automatically use the demo credentials and show you the results
4. This page is useful for debugging login issues without having to manually enter credentials

## Troubleshooting

If you encounter login issues:

1. **Ensure Backend is Running**: Verify that the backend server is running on port 5000
2. **Check Network Requests**: Use browser developer tools to inspect network requests
3. **Clear Browser Storage**: Try clearing your browser's local storage and cookies
4. **API URL Configuration**: Verify the frontend is trying to connect to http://localhost:5000

### Fixing React Hook Errors

If you see React errors like "Rendered fewer hooks than expected", this has been fixed by:

1. Updating the ProtectedRoute component in App.js to avoid conditional hooks
2. Fixing conditional rendering in HomePage.js to maintain consistent hook calls
3. Using proper patterns for conditional rendering throughout the application

These fixes address the common React Hook Rules issue where the number of hook calls must be consistent between renders.

## Login Test Results ✅

Both demo accounts have been tested and confirmed to work:

```
Testing student login...
Student login successful!
Student data: {
  message: 'Login successful',
  accessToken: 'eyJhbGciOiJ...',
  refreshToken: 'eyJhbGci...',
  student: {
    _id: '6821c41d33c4f61d671df417',
    username: 'demo_student',
    name: 'Demo Student'
  }
}

Testing tutor login...
Tutor login successful!
Tutor data: {
  message: 'Login successful',
  tutor: {
    _id: '6821c41d33c4f61d671df418',
    username: 'demo_tutor',
    name: 'Demo Tutor',
    ...
  }
}
```

## Note

These demo accounts have been pre-created with minimal required information to allow testing of the application without going through the registration process. You can freely use them to explore all features of the student and tutor roles.
