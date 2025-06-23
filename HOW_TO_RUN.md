# How to Run the Integrated Learning Platform

## 💻 Quick Start Guide (For Complete Beginners)

### Method 1: Automatic Start (Recommended)

1. **Navigate to the Project Folder**
   - Open File Explorer
   - Go to: `c:\Users\1887s\OneDrive\Desktop\kanishk\internship\full_gpt\integrated-website`

2. **Run the Start Script**
   - Find the file named `start-app.bat`
   - Double-click on it
   - Two command prompt windows will open automatically:
     - One for the backend server (running on port 5000)
     - One for the frontend server (running on port 3000)

3. **Wait for Startup to Complete**
   - The backend will start first
   - After about 5 seconds, the frontend will start
   - Your default web browser should open automatically to http://localhost:3000

4. **You're Ready to Go!**
   - Use the demo accounts to log in:
     - Student: `demo_student` / `password123`
     - Tutor: `demo_tutor` / `password123`
   - Or visit http://localhost:3000/test-login for a quick login test

### Method 2: Manual Setup (For Advanced Users)

## 📋 Prerequisites
- **Node.js**: Version 16 or higher installed
  - Download from [nodejs.org](https://nodejs.org/)
  - To check if installed, open Command Prompt and type: `node --version`
- **npm**: Comes with Node.js
  - To check if installed, open Command Prompt and type: `npm --version`
- **Internet Connection**: Required for MongoDB Atlas database access

## Step 1: Start the Backend Server

1. **Open Command Prompt**
   - Press `Win + R`, type `cmd` and press Enter

2. **Navigate to Backend Directory**
   ```
   cd c:\Users\1887s\OneDrive\Desktop\kanishk\internship\full_gpt\integrated-website\backend
   ```

3. **Install Dependencies** (first time only)
   ```
   npm install
   ```

4. **Start the Server**
   ```
   npm start
   ```

5. **Verify Backend is Running**
   - You should see messages like:
     - "Connected to MongoDB Atlas"
     - "Server is running on port 5000"

## Step 2: Start the Frontend Application

1. **Open a New Command Prompt Window**
   - Press `Win + R`, type `cmd` and press Enter

2. **Navigate to Frontend Directory**
   ```
   cd c:\Users\1887s\OneDrive\Desktop\kanishk\internship\full_gpt\integrated-website\frontend
   ```

3. **Install Dependencies** (first time only)
   ```
   npm install
   ```

4. **Start the Frontend Server**
   ```
   npm start
   ```

5. **Your Browser Should Open Automatically**
   - If it doesn't, manually go to: http://localhost:3000

## 🔑 Using Demo Accounts

After the application is running, you can immediately log in:

### Student Demo Account:
- **Username:** `demo_student`
- **Password:** `password123`

### Tutor Demo Account:
- **Username:** `demo_tutor`
- **Password:** `password123`

### Super Easy Testing Option:
1. Go directly to: http://localhost:3000/test-login
2. Click either "Test Student Login" or "Test Tutor Login" button 
3. The system will automatically log you in and show you the success message

For detailed login instructions and troubleshooting, see the [HOW_TO_LOGIN.md](./HOW_TO_LOGIN.md) file.

## ✅ What to Try First

### As a Student:
1. Log in with the student demo account
2. Try the "Search Tutors" feature
3. Book a class with a tutor
4. View your scheduled classes on your dashboard

### As a Tutor:
1. Log in with the tutor demo account
2. Check your dashboard statistics
3. Try uploading a sample video
4. Explore the course management section
## ❓ Troubleshooting Guide

### Common Issues and Solutions

#### Application Won't Start

**1. Port Already in Use**
- **Symptom:** Error message about port 3000 or 5000 already being in use
- **Solution:** 
  - Close any other applications using these ports
  - Use Task Manager to close node.js processes
  - Try restarting your computer

**2. Node.js Installation Issues**
- **Symptom:** "node is not recognized as internal or external command"
- **Solution:**
  - Make sure Node.js is installed properly
  - Restart your computer after installation
  - Add Node.js to your PATH environment variable

**3. npm Install Errors**
- **Symptom:** Errors during `npm install` 
- **Solution:**
  - Try deleting the `node_modules` folder and running `npm install` again
  - Check your internet connection
  - Try running as administrator: Right-click command prompt and select "Run as administrator"

#### Login Problems

**1. Login Fails with Correct Credentials**
- **Symptom:** "Invalid credentials" message despite using correct login info
- **Solution:**
  - Make sure backend server is running
  - Check browser console for API errors
  - Try using the /test-login page to verify server connectivity
  - Ensure you're using the exact credentials as shown (case sensitive)

**2. Page Loading Issues**
- **Symptom:** Blank screen or spinning loader that never completes
- **Solution:**
  - Check browser console for errors (Press F12 to open)
  - Try a hard refresh (Ctrl+F5)
  - Clear browser cache and cookies

## 🔄 Restarting The Application

If you need to restart the application:

1. **Close both command prompt windows** (backend and frontend)
2. **Run the start-app.bat file again**

Or if you're using Method 2 (manual setup):
1. Press **Ctrl+C** in each command prompt window
2. Type **Y** when asked "Terminate batch job?"
3. Follow the startup steps again

## 📊 System Requirements

- **Operating System:** Windows 10 or 11
- **Browser:** Chrome, Firefox, or Edge (latest versions recommended)
- **RAM:** 4GB minimum, 8GB recommended
- **Disk Space:** 500MB free space
- **Node.js:** v16.0.0 or higher
- **Internet:** Stable connection required for database access

## 📱 Mobile Access

While the application is designed primarily for desktop use, you can access it on mobile devices:

1. Make sure both servers are running on your computer
2. Find your computer's local IP address (type `ipconfig` in command prompt)
3. On your mobile device (connected to same WiFi), visit:
   - `http://[your-computer-ip]:3000`

## 🎉 You're All Set!

Congratulations! You've successfully set up and started the Integrated Learning Platform. Explore the features, try both user roles, and enjoy the application!

If you need any help, refer to the [HOW_TO_LOGIN.md](./HOW_TO_LOGIN.md) for login details or check the [README.md](./README.md) for an overview of all features.
