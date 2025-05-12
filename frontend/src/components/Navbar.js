import React from 'react';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { student, tutor, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Create individual matches for each path we need to check
  const homeMatch = useMatch('/');
  const loginMatch = useMatch('/login');
  const tutorLoginMatch = useMatch('/tutor-login');
  const studentRegisterMatch = useMatch('/student-register');
  const signupMatch = useMatch('/signup');
  const studentDashboardMatch = useMatch('/student-dashboard');
  const studentCalendarMatch = useMatch('/student-calendar');
  const classRegistrationMatch = useMatch('/class-registration');
  const teacherDashboardMatch = useMatch('/teacher/dashboard');
  const teacherCourseManagementMatch = useMatch('/teacher/CourseManagement');
  
  const handleLogout = async () => {
    if (student) {
      await logout('student');
      navigate('/login');
    } else if (tutor) {
      await logout('tutor');
      navigate('/tutor-login');
    }
  };
    // Helper function to determine class name
  const getClassName = (match) => match ? 'navbar-link active' : 'navbar-link';
  
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Learning Platform</Link>
      
      <div className="navbar-links">
        <Link to="/" className={getClassName(homeMatch)}>Home</Link>
        
        {!isAuthenticated ? (
          <>
            <Link to="/login" className={getClassName(loginMatch)}>Student Login</Link>
            <Link to="/tutor-login" className={getClassName(tutorLoginMatch)}>Tutor Login</Link>
            <Link to="/student-register" className={getClassName(studentRegisterMatch)}>Student Register</Link>
            <Link to="/signup" className={getClassName(signupMatch)}>Tutor Register</Link>
          </>
        ) : student ? (
          <>
            <Link to="/student-dashboard" className={getClassName(studentDashboardMatch)}>Dashboard</Link>
            <Link to="/student-calendar" className={getClassName(studentCalendarMatch)}>Calendar</Link>
            <Link to="/class-registration" className={getClassName(classRegistrationMatch)}>Register Class</Link>
            <button onClick={handleLogout} className="navbar-link">Logout</button>
          </>
        ) : tutor && (
          <>
            <Link to="/teacher/dashboard" className={getClassName(teacherDashboardMatch)}>Dashboard</Link>
            <Link to="/teacher/CourseManagement" className={getClassName(teacherCourseManagementMatch)}>Courses</Link>
            <button onClick={handleLogout} className="navbar-link">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
