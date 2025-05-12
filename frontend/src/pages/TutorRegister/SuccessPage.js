import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { CheckCircleOutline as CheckIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { useAuth } from '../../context/AuthContext';

const SuccessIcon = styled(CheckIcon)(({ theme }) => ({
  fontSize: 80,
  color: green[500],
  marginBottom: theme.spacing(2),
}));

const SuccessPage = () => {
  const navigate = useNavigate();
  const { tutor } = useAuth();
  
  // If user refreshes or accesses this page directly without completing registration
  useEffect(() => {
    const tutorId = localStorage.getItem('tutorId');
    if (!tutorId && !tutor) {
      navigate('/signup');
    }
  }, [navigate, tutor]);
  
  // Steps for registration process
  const steps = [
    'Account Setup', 
    'Personal Details', 
    'Languages', 
    'Teaching Experience', 
    'Video Upload',
    'Course Details'
  ];

  const handleDashboardClick = () => {
    navigate('/teacher/dashboard');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stepper activeStep={6} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label} completed>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          <SuccessIcon />
          
          <Typography variant="h4" align="center" gutterBottom>
            Registration Successful!
          </Typography>
          
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Thank you for registering as a tutor.
          </Typography>
          
          <Typography variant="body1" align="center" paragraph sx={{ maxWidth: 600 }}>
            Your profile has been created successfully. Our team will review your application
            and video within 1-3 business days. You'll receive an email once your profile is approved.
          </Typography>
          
          <Typography variant="body1" align="center" paragraph sx={{ maxWidth: 600 }}>
            In the meantime, you can complete your profile, add more courses, or explore the platform.
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleDashboardClick}
            >
              Go to Dashboard
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SuccessPage;
