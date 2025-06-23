# 🔑 Login Instructions for Beginners

This guide will help you log into the application with pre-created demo accounts. No registration needed!

## 👨‍🎓 Ready-to-Use Demo Accounts ✅

We've set up these accounts for you to use immediately:

| **Role** | **Username** | **Password** | **What You Can Do** |
|----------|--------------|--------------|---------------------|
| Student | demo_student | password123 | Search tutors, book classes, view schedule |
| Tutor | demo_tutor | password123 | Upload videos, manage courses, see statistics |

## 🚨 Before You Login - Important!

Make sure:
1. ✅ Both servers are running (backend + frontend)
2. ✅ Backend is on port 5000
3. ✅ Frontend is on port 3000

Not sure if everything is running? Use the `start-app.bat` file to start everything automatically!

## 🔄 Three Ways to Login

### Method 1: Super Easy Test Login (Recommended for Beginners)

1. **Go to the Test Login Page**
   - Open your browser and go to: http://localhost:3000/test-login
   - This special page has automatic login buttons

2. **Click the Test Button**
   - For student access: Click "Test Student Login"
   - For tutor access: Click "Test Tutor Login"

3. **Automatic Login**
   - The system will automatically log you in
   - You'll see a success message and be redirected to the dashboard

### Method 2: Regular Login Page

1. **Go to the Main Page**
   - Open your browser and go to: http://localhost:3000

2. **Select Login Type**
   - For student: Click "Student Login" in the navigation menu
   - For tutor: Click "Tutor Login" in the navigation menu

3. **Enter Credentials**
   - Username: `demo_student` or `demo_tutor`
   - Password: `password123`

4. **Click Login Button**
   - You'll be redirected to your dashboard

### Method 3: Direct URL Login

You can also go directly to the login pages:

- **Student Login:** http://localhost:3000/student/login
- **Tutor Login:** http://localhost:3000/tutor/login

## 📱 What You'll See After Login

### Student Dashboard
After logging in as a student, you'll see:
- Your upcoming classes
- Search feature for finding tutors
- Calendar view of scheduled sessions
- Profile management options

### Tutor Dashboard
After logging in as a tutor, you'll see:
- Class statistics
- Video upload section
- Course management tools
- Student attendance records

## ❓ Troubleshooting Login Issues

### Common Login Problems

| **Problem** | **Solution** |
|-------------|--------------|
| "Invalid credentials" error | Double-check username and password - they are case sensitive |
| Login button not working | Make sure the backend server is running on port 5000 |
| Infinite loading spinner | Try clearing browser cache (Ctrl+F5) or try another browser |
| "Network error" message | Check that both servers are running properly |
| Blank screen after login | Check browser console (F12) for JavaScript errors |

### Quick Fixes to Try:

1. **Refresh the page**: Simple but often works!
2. **Clear browser data**: 
   - Press Ctrl+Shift+Delete
   - Select "Cookies and site data" 
   - Click "Clear data"
3. **Try incognito/private mode**: 
   - Chrome: Ctrl+Shift+N
   - Firefox: Ctrl+Shift+P
4. **Check if servers are running**:
   - Backend should show "Server running on port 5000"
   - Frontend should show "Compiled successfully"

## ✅ Successful Login Confirmation

When login succeeds, you'll see these indicators:

- Redirect to your dashboard
- Your name displayed in the top-right corner
- Full access to all features for your role## 🚀 First Time Using the App?

### As a Student, Try:
1. **Searching for tutors** - Try different subjects and languages
2. **Booking a class** - Schedule a session with a tutor
3. **Checking your calendar** - See your upcoming schedule
4. **Exploring your profile** - Update your preferences

### As a Tutor, Try:  
1. **Checking statistics** - See your teaching activity
2. **Uploading a sample video** - Add some content for students
3. **Managing your courses** - Add or edit course information
4. **Setting your availability** - Configure when you can teach

## 📞 Need More Help?

If you're still having trouble logging in or using the application, check:

1. [HOW_TO_RUN.md](./HOW_TO_RUN.md) - For setup instructions
2. [README.md](./README.md) - For overview of all features

Or try restarting both servers using the `start-app.bat` file!

---

Enjoy exploring the Integrated Learning Platform! 🎓
