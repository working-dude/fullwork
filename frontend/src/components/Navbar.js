import React from 'react';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { student, tutor, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const isActive = (path) => {
    return useMatch(path) ? 'navbar-link active' : 'navbar-link';
  };
  
  const handleLogout = async () => {
    if (student) {
      await logout('student');
      navigate('/login');
    } else if (tutor) {
      await logout('tutor');
      navigate('/tutor-login');
    }
  };
  
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Learning Platform</Link>
      
      <div className="navbar-links">
        <Link to="/" className={isActive('/')}>Home</Link>
        
        {!isAuthenticated ? (
          <>
            <Link to="/login" className={isActive('/login')}>Student Login</Link>
            <Link to="/tutor-login" className={isActive('/tutor-login')}>Tutor Login</Link>
            <Link to="/student-register" className={isActive('/student-register')}>Student Register</Link>
            <Link to="/signup" className={isActive('/signup')}>Tutor Register</Link>
          </>
        ) : student ? (
          <>
            <Link to="/student-dashboard" className={isActive('/student-dashboard')}>Dashboard</Link>
            <Link to="/student-calendar" className={isActive('/student-calendar')}>Calendar</Link>
            <Link to="/class-registration" className={isActive('/class-registration')}>Register Class</Link>
            <button onClick={handleLogout} className="navbar-link">Logout</button>
          </>
        ) : tutor && (
          <>
            <Link to="/teacher/dashboard" className={isActive('/teacher/dashboard')}>Dashboard</Link>
            <Link to="/teacher/CourseManagement" className={isActive('/teacher/CourseManagement')}>Courses</Link>
            <button onClick={handleLogout} className="navbar-link">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
