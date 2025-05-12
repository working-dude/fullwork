import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, student, tutor } = useAuth();
  
  // Prepare content based on auth state, but don't use conditional rendering for the main structure
  let welcomeContent;
  
  if (!isAuthenticated) {
    welcomeContent = (
      <div className="cta-buttons">
        <Link to="/student-register" className="cta-button">
          Register as Student
        </Link>
        <Link to="/signup" className="cta-button">
          Register as Tutor
        </Link>
      </div>
    );
  } else if (student) {
    welcomeContent = (
      <div className="welcome-section">
        <h2>Welcome back, {student.name || 'Student'}!</h2>
        <p>Continue your learning journey</p>
        <Link to="/student-dashboard" className="cta-button">
          Go to Dashboard
        </Link>
      </div>
    );
  } else {
    welcomeContent = (
      <div className="welcome-section">
        <h2>Welcome back, {tutor?.name || 'Tutor'}!</h2>
        <p>Manage your teaching activities</p>
        <Link to="/teacher/dashboard" className="cta-button">
          Go to Dashboard
        </Link>
      </div>
    );
  }
  
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to the Integrated Learning Platform</h1>
        <p className="hero-text">
          Connect students and teachers in an interactive learning environment.
        </p>
        
        {welcomeContent}
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

      <div className="admin-section" style={{ 
        margin: '40px 0', 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2>Quick Access for Testing</h2>
        <p>Use these credentials to access the dashboards directly:</p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: '20px', 
          marginTop: '20px' 
        }}>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#e6f7ff', 
            borderRadius: '8px',
            width: '250px'
          }}>
            <h3>Student Access</h3>
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> admin</p>
            <Link to="/student-login" className="cta-button" style={{ 
              display: 'inline-block',
              marginTop: '10px'
            }}>
              Student Login
            </Link>
          </div>
          
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#e6fff7', 
            borderRadius: '8px',
            width: '250px'
          }}>
            <h3>Tutor Access</h3>
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> admin</p>
            <Link to="/login" className="cta-button" style={{ 
              display: 'inline-block',
              marginTop: '10px'
            }}>
              Tutor Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
