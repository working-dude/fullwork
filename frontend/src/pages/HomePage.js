import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, student, tutor } = useAuth();
  
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to the Integrated Learning Platform</h1>
        <p className="hero-text">
          Connect students and teachers in an interactive learning environment.
        </p>
        
        {!isAuthenticated ? (
          <div className="cta-buttons">
            <Link to="/student-register" className="cta-button">
              Register as Student
            </Link>
            <Link to="/signup" className="cta-button">
              Register as Tutor
            </Link>
          </div>
        ) : student ? (
          <div className="welcome-section">
            <h2>Welcome back, {student.name || 'Student'}!</h2>
            <p>Continue your learning journey</p>
            <Link to="/student-dashboard" className="cta-button">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="welcome-section">
            <h2>Welcome back, {tutor.name || 'Tutor'}!</h2>
            <p>Manage your teaching activities</p>
            <Link to="/teacher/dashboard" className="cta-button">
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
      
      <div className="features-section">
        <h2>Platform Features</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <h3>For Students</h3>
            <ul>
              <li>Find qualified tutors</li>
              <li>Book classes in preferred languages</li>
              <li>Track class schedule with calendar</li>
              <li>Access learning materials</li>
            </ul>
          </div>
          
          <div className="feature-card">
            <h3>For Tutors</h3>
            <ul>
              <li>Manage your teaching schedule</li>
              <li>Upload educational videos</li>
              <li>Track analytics and statistics</li>
              <li>Create and manage courses</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="how-it-works">
        <h2>How It Works</h2>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register an Account</h3>
            <p>Sign up as a student or tutor with basic information</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Complete Your Profile</h3>
            <p>Add details about languages, subjects, and preferences</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Connect & Learn</h3>
            <p>Book classes, upload videos, and engage in interactive learning</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
