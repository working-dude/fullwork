@echo off
echo ===================================
echo Integrated Learning Platform Startup
echo ===================================

echo.
echo Step 1: Starting Backend Server...
echo.
start cmd /k "cd c:\Users\1887s\OneDrive\Desktop\kanishk\internship\full_gpt\integrated-website\backend && npm start"

echo.
echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo.
echo Step 2: Starting Frontend Dev Server...
echo.
start cmd /k "cd c:\Users\1887s\OneDrive\Desktop\kanishk\internship\full_gpt\integrated-website\frontend && npm start"

echo.
echo ===================================
echo Both servers should now be starting!
echo.
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
echo.
echo - Use demo accounts:
echo   Student: demo_student / password123
echo   Tutor: demo_tutor / password123
echo.
echo - Test login page: http://localhost:3000/test-login
echo ===================================
echo.

pause
