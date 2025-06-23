import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TutorRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { loginTutor } = useAuth();

  // Steps for registration process
  const steps = [
    'Account Setup', 
    'Personal Details', 
    'Languages', 
    'Teaching Experience', 
    'Video Upload',
    'Course Details'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!formData.password.trim()) {
      setError('Password is required');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setLoading(true);
    setError('');
      try {
        console.log('Submitting registration:', formData);
      // Register with just email and password for now
      const response = await api.post('/api/tutor/register', {
        email: formData.email,
        password: formData.password,
        name: 'temp', // Temporary values to pass validation
        city: 'temp',
        state: 'temp',
        aadhar: 'temp'
      });
      console.log('Registration response:', response);
      const data = response.data; // Use response.data for axios
      
      if (response.status !== 201) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Store tutor ID in localStorage for the registration flow
      localStorage.setItem('tutorId', data.tutor._id);
        // Move to next step in registration process
      navigate('/personal-details');
        } catch (error) {
      console.error('Registration error:', error);
      
      // Extract error message from response
      let errorMessage = 'Failed to register. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Tutor Registration
        </Typography>
        
        <Stepper activeStep={0} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={formData.email}
            onChange={handleChange}
          />
          
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={formData.password}
            onChange={handleChange}
          />
          
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Next: Personal Details'}
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Button
                onClick={() => navigate('/tutor-login')}
                color="primary"
                sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
              >
                Login here
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default TutorRegister;
