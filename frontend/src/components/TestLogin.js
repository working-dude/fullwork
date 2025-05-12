import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Paper, Container, Alert } from '@mui/material';

// Note: When using React Hooks, always follow these rules:
// 1. Only call Hooks at the top level of your React function components
// 2. Only call Hooks from React function components or custom hooks
// 3. Custom hooks must start with "use"

const TestLogin = () => {
  // All hooks are called at the top level - correct pattern
  const [studentResult, setStudentResult] = useState(null);
  const [tutorResult, setTutorResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testStudentLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/student/login', {
        username: 'demo_student',
        password: 'password123'
      });
      setStudentResult(response.data);
    } catch (error) {
      setError(`Student login error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testTutorLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/tutor/login', {
        username: 'demo_tutor',
        password: 'password123'
      });
      setTutorResult(response.data);
    } catch (error) {
      setError(`Tutor login error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, my: 3 }}>
        <Typography variant="h4" gutterBottom>Login Test Tool</Typography>
        <Typography variant="body1" paragraph>
          Use this tool to test the demo account login credentials directly without navigating through the app.
        </Typography>

        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={testStudentLogin}
            disabled={loading}
          >
            Test Student Login
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={testTutorLogin}
            disabled={loading}
          >
            Test Tutor Login
          </Button>
        </Box>

        {loading && <Typography>Testing login...</Typography>}

        {studentResult && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Student Login Result:</Typography>
            <Paper elevation={1} sx={{ p: 2, bgcolor: 'success.light', color: 'white', my: 1 }}>
              <Typography>Login successful! Student: {studentResult.student.name}</Typography>
            </Paper>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Full Response Data"
              value={JSON.stringify(studentResult, null, 2)}
              InputProps={{ readOnly: true }}
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </Box>
        )}

        {tutorResult && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Tutor Login Result:</Typography>
            <Paper elevation={1} sx={{ p: 2, bgcolor: 'success.light', color: 'white', my: 1 }}>
              <Typography>Login successful! Tutor: {tutorResult.tutor.name}</Typography>
            </Paper>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Full Response Data"
              value={JSON.stringify(tutorResult, null, 2)}
              InputProps={{ readOnly: true }}
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TestLogin;
