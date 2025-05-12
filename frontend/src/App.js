import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import HomePage from './pages/HomePage';
import StudentLogin from './pages/StudentLogin';
import TutorLogin from './pages/TutorLogin';
import StudentRegister from './pages/StudentRegister';
import TutorRegister from './pages/TutorRegister';
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import StudentCalendar from './pages/StudentCalendar';
import ClassRegistration from './pages/ClassRegistration';
import CourseManagement from './pages/CourseManagement';
import PersonalDetails from './pages/TutorRegister/PersonalDetails';
import Languages from './pages/TutorRegister/Languages';
import Experience from './pages/TutorRegister/Experience';
import VideoUpload from './pages/TutorRegister/VideoUpload';
import Courses from './pages/TutorRegister/Courses';
import SuccessPage from './pages/TutorRegister/SuccessPage';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute = ({ children, userType }) => {
  const { student, tutor, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="container text-center">Loading...</div>;
  }
  
  if (userType === 'student' && !student) {
    return <Navigate to="/login" />;
  }
  
  if (userType === 'tutor' && !tutor) {
    return <Navigate to="/tutor-login" />;
  }
  
  return children;
};

const App = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/tutor-login" element={<TutorLogin />} />
          <Route path="/student-register" element={<StudentRegister />} />
          
          {/* Tutor registration flow */}
          <Route path="/signup" element={<TutorRegister />} />
          <Route path="/personal-details" element={<PersonalDetails />} />
          <Route path="/languages" element={<Languages />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/video-upload" element={<VideoUpload />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/success" element={<SuccessPage />} />
          
          {/* Protected student routes */}
          <Route 
            path="/student-dashboard" 
            element={
              <ProtectedRoute userType="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student-calendar" 
            element={
              <ProtectedRoute userType="student">
                <StudentCalendar />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/class-registration" 
            element={
              <ProtectedRoute userType="student">
                <ClassRegistration />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected tutor routes */}
          <Route 
            path="/teacher/dashboard" 
            element={
              <ProtectedRoute userType="tutor">
                <TutorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/CourseManagement" 
            element={
              <ProtectedRoute userType="tutor">
                <CourseManagement />
              </ProtectedRoute>
            } 
          />
          
          {/* Handle 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
