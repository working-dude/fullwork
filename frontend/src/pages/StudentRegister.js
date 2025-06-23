import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Box, 
  Alert, 
  FormControlLabel,
  Checkbox
} from '@mui/material';
import api from '../utils/api';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    dob: '',
    birthPlace: '',
    currentLocation: '',
    motherLanguage: '',
    localLanguage: '',
    presentAddress: { address: '', city: '', pincode: '' },
    permanentAddress: { address: '', city: '', pincode: '' },
    sameAsPresent: false,
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckbox = () => {
    const sameAsPresent = !formData.sameAsPresent;
    setFormData((prev) => ({
      ...prev,
      sameAsPresent,
      permanentAddress: sameAsPresent 
        ? { ...prev.presentAddress } 
        : { address: '', city: '', pincode: '' }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/api/student/register', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        dob: formData.dob,
        birthPlace: formData.birthPlace,
        currentLocation: formData.currentLocation,
        motherLanguage: formData.motherLanguage,
        localLanguage: formData.localLanguage,
        presentAddress: formData.presentAddress,
        permanentAddress: formData.sameAsPresent 
          ? formData.presentAddress 
          : formData.permanentAddress,
        sameAsPresent: formData.sameAsPresent,
      });
      
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('studentId', response.data.student.id);
        localStorage.setItem('studentInfo', JSON.stringify(response.data.student));
        navigate('/student-dashboard');
      } else {
        navigate('/login');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Student Registration
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="email"
                fullWidth
                required
                margin="normal"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                label="Full Name"
                fullWidth
                required
                margin="normal"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="password"
                type="password"
                label="Password"
                fullWidth
                required
                margin="normal"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                fullWidth
                required
                margin="normal"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="dob"
                type="date"
                label="Date of Birth"
                fullWidth
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={formData.dob}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="birthPlace"
                label="Birth Place"
                fullWidth
                required
                margin="normal"
                value={formData.birthPlace}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="currentLocation"
                label="Current Location"
                fullWidth
                required
                margin="normal"
                value={formData.currentLocation}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="motherLanguage"
                label="Mother Language"
                fullWidth
                required
                margin="normal"
                value={formData.motherLanguage}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="localLanguage"
                label="Language to Study"
                fullWidth
                required
                margin="normal"
                value={formData.localLanguage}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Present Address */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Present Address
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="presentAddress.address"
                label="Address"
                fullWidth
                required
                margin="normal"
                value={formData.presentAddress.address}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="presentAddress.city"
                label="City"
                fullWidth
                required
                margin="normal"
                value={formData.presentAddress.city}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="presentAddress.pincode"
                label="Pincode"
                fullWidth
                required
                margin="normal"
                value={formData.presentAddress.pincode}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Checkbox for same address */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.sameAsPresent} 
                    onChange={handleCheckbox} 
                    name="sameAsPresent" 
                  />
                }
                label="Permanent Address is same as Present Address"
              />
            </Grid>
            
            {/* Permanent Address (conditionally disabled) */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Permanent Address
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="permanentAddress.address"
                label="Address"
                fullWidth
                required
                margin="normal"
                value={formData.permanentAddress.address}
                onChange={handleChange}
                disabled={formData.sameAsPresent}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="permanentAddress.city"
                label="City"
                fullWidth
                required
                margin="normal"
                value={formData.permanentAddress.city}
                onChange={handleChange}
                disabled={formData.sameAsPresent}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="permanentAddress.pincode"
                label="Pincode"
                fullWidth
                required
                margin="normal"
                value={formData.permanentAddress.pincode}
                onChange={handleChange}
                disabled={formData.sameAsPresent}
              />
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 4 }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Button
                onClick={() => navigate('/login')}
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

export default StudentRegister;
