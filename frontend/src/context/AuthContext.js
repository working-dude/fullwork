import React, { createContext, useState, useContext, useEffect } from 'react';
// import api from '../utils/api';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for stored tokens/info
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const studentInfo = localStorage.getItem('studentInfo');
        const tutorInfo = localStorage.getItem('tutorInfo');

        if (studentInfo) {
          setStudent(JSON.parse(studentInfo));
        }

        if (tutorInfo) {
          setTutor(JSON.parse(tutorInfo));
        }

        if (accessToken && refreshToken && !studentInfo) {
          // Token exists but no student info - fetch from API
          const studentId = localStorage.getItem('studentId');
          if (studentId) {
            const response = await axios.get(`/api/student/profile?studentId=${studentId}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            setStudent(response.data);
            localStorage.setItem('studentInfo', JSON.stringify(response.data));
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setError('Failed to authenticate');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);
  // Student login
  const loginStudent = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/student/login`, { email, password });
      console.log('Login response:', response.data);
      const { accessToken, refreshToken, student } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('studentId', student._id);
      localStorage.setItem('studentInfo', JSON.stringify(student));

      setStudent(student);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  // Tutor login
  const loginTutor = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/tutor/login`, { email, password });

      const { tutor } = response.data;

      localStorage.setItem('tutorInfo', JSON.stringify(tutor));

      setTutor(tutor);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async (type) => {
    try {
      if (type === 'student') {
        const studentId = localStorage.getItem('studentId');
        console.log('Logging out student with ID:', studentId);
        console.log('localStorage before logout:', localStorage);
        // Call API to log out student
        console.log("api call to logout student", `${API_BASE_URL}/api/student/logout`, { studentId });
        if (studentId) {
          await axios.post(`${API_BASE_URL}/api/student/logout`, { _id: studentId });
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('studentId');
        localStorage.removeItem('studentInfo');
        setStudent(null);
      } else if (type === 'tutor') {
        localStorage.removeItem('tutorInfo');
        setTutor(null);
      }
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };
  // Refresh token
  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) return false;

      const response = await axios.post(`${API_BASE_URL}/api/student/refresh-token`, { refreshToken: refreshTokenValue });
      localStorage.setItem('accessToken', response.data.accessToken);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const value = {
    student,
    tutor,
    isLoading,
    error,
    loginStudent,
    loginTutor,
    logout,
    refreshToken,
    isAuthenticated: !!(student || tutor)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
