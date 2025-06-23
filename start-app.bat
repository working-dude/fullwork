@echo off
color 0A
echo ===================================
echo  Integrated Learning Platform Startup
echo  Beginner-Friendly Version
echo ===================================

echo.
echo  Step 1: Starting Backend Server...
echo.
start cmd /k "color 0B && echo BACKEND SERVER && echo. && cd c:\Users\1887s\OneDrive\Desktop\kanishk\internship\full_gpt\integrated-website\backend && npm start"

echo  Please wait while the backend starts...
timeout /t 5 /nobreak > nul

echo.
echo  Step 2: Starting Frontend Dev Server...
echo.
start cmd /k "color 0E && echo FRONTEND SERVER && echo. && cd c:\Users\1887s\OneDrive\Desktop\kanishk\internship\full_gpt\integrated-website\frontend && npm start"

echo.
echo  Please wait while the frontend starts...
timeout /t 3 /nobreak > nul

cls
echo ===================================
echo  SUCCESS! App is starting up...
echo ===================================
echo.
echo  Your browser should open automatically in a moment.
echo  If not, open your browser and go to:
echo  http://localhost:3000
echo.
echo  DEMO ACCOUNTS:
echo  -----------------------------
echo  ROLE    | USERNAME    | PASSWORD
echo  -----------------------------
echo  Student | demo_student | password123
echo  Tutor   | demo_tutor   | password123
echo.
echo  QUICK LINKS:
echo  - Main page: http://localhost:3000
echo  - Test login: http://localhost:3000/test-login
echo ===================================
echo.
echo  Press any key to close this window...
echo  (Closing this will NOT stop the servers)

pause > nul
