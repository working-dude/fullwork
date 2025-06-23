import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Alert,
  Grid,
  TextField,
  IconButton,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import api from '../../utils/api';

const Experience = () => {
  const [experiences, setExperiences] = useState([
    { 
      title: '', 
      organization: '', 
      location: '',
      startDate: '',
      endDate: '', 
      current: false,
      description: ''
    }
  ]);
  
  const [certifications, setCertifications] = useState([
    {
      name: '',
      issuingOrganization: '',
      date: '',
      credentialId: ''
    }
  ]);
  
  const [qualifications, setQualifications] = useState({
    highestQualification: '',
    degree: '',
    institution: '',
    graduationYear: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Steps for registration process
  const steps = [
    'Account Setup', 
    'Personal Details', 
    'Languages', 
    'Teaching Experience', 
    'Video Upload',
    'Course Details'
  ];
  
  // Experience handlers
  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][field] = value;
    setExperiences(updatedExperiences);
  };
  
  const addExperience = () => {
    setExperiences([
      ...experiences,
      { 
        title: '', 
        organization: '', 
        location: '',
        startDate: '',
        endDate: '', 
        current: false,
        description: ''
      }
    ]);
  };
  
  const removeExperience = (index) => {
    if (experiences.length <= 1) {
      setError('You must have at least one experience entry');
      return;
    }
    
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
  };
  
  // Certification handlers
  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = [...certifications];
    updatedCertifications[index][field] = value;
    setCertifications(updatedCertifications);
  };
  
  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        name: '',
        issuingOrganization: '',
        date: '',
        credentialId: ''
      }
    ]);
  };
  
  const removeCertification = (index) => {
    if (certifications.length <= 1) {
      setError('You must have at least one certification entry');
      return;
    }
    
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCertifications);
  };
  
  // Qualification handlers
  const handleQualificationChange = (field, value) => {
    setQualifications(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setLoading(true);
    
    try {
      const tutorId = localStorage.getItem('tutorId');
      if (!tutorId) {
        throw new Error('Registration session expired. Please start over.');
      }

      // Only send if user has filled some data, otherwise send default values
      const hasExperienceData = experiences.some(exp => 
        exp.title.trim() || exp.organization.trim() || exp.description.trim()
      );
      
      const hasCertificationData = certifications.some(cert => 
        cert.name.trim() || cert.issuingOrganization.trim()
      );
      
      const hasQualificationData = qualifications.highestQualification || 
        qualifications.degree.trim() || qualifications.institution.trim();

      // Use default values if no data provided
      const finalExperiences = hasExperienceData ? experiences : [{
        title: 'Teaching Experience',
        organization: 'Various Institutions',
        location: 'Online/Offline',
        startDate: '2020-01-01',
        endDate: '',
        current: true,
        description: 'Experienced in teaching and mentoring students.'
      }];

      const finalCertifications = hasCertificationData ? certifications : [{
        name: 'Teaching Certification',
        issuingOrganization: 'Educational Institution',
        date: '2020-01-01',
        credentialId: 'TC001'
      }];

      const finalQualifications = hasQualificationData ? qualifications : {
        highestQualification: 'Bachelor\'s Degree',
        degree: 'General Studies',
        institution: 'University',
        graduationYear: '2020'
      };

      const response = await api.put('/api/tutor/experience', {
        tutorId,
        experiences: finalExperiences,
        certifications: finalCertifications,
        qualifications: finalQualifications
      });
      
      if (response.status === 200) {
        // Move to next step in registration process
        navigate('/video-upload');
      }
      
    } catch (error) {
      console.error('Error saving experience:', error);
      setError(error.response?.data?.message || 'Failed to save experience information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Skip to next step without saving
    navigate('/video-upload');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Teaching Experience
        </Typography>
        
        <Stepper activeStep={3} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          {/* Education */}
          <Typography variant="h6" gutterBottom>
            Educational Background
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required margin="normal">
                <InputLabel>Highest Qualification</InputLabel>
                <Select
                  value={qualifications.highestQualification}
                  label="Highest Qualification"
                  onChange={(e) => handleQualificationChange('highestQualification', e.target.value)}
                >
                  <MenuItem value="High School">High School</MenuItem>
                  <MenuItem value="Associate's Degree">Associate's Degree</MenuItem>
                  <MenuItem value="Bachelor's Degree">Bachelor's Degree</MenuItem>
                  <MenuItem value="Master's Degree">Master's Degree</MenuItem>
                  <MenuItem value="Doctorate">Doctorate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Field of Study/Degree"
                fullWidth
                margin="normal"
                value={qualifications.degree}
                onChange={(e) => handleQualificationChange('degree', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Institution"
                fullWidth
                required
                margin="normal"
                value={qualifications.institution}
                onChange={(e) => handleQualificationChange('institution', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Graduation Year"
                fullWidth
                required
                margin="normal"
                type="number"
                value={qualifications.graduationYear}
                onChange={(e) => handleQualificationChange('graduationYear', e.target.value)}
                InputProps={{ inputProps: { min: 1950, max: new Date().getFullYear() } }}
              />
            </Grid>
          </Grid>
          
          {/* Work Experience */}
          <Typography variant="h6" gutterBottom>
            Work Experience
          </Typography>
          
          {experiences.map((exp, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">Experience #{index + 1}</Typography>
                  
                  <IconButton 
                    color="error" 
                    onClick={() => removeExperience(index)}
                    disabled={experiences.length <= 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Job Title"
                      fullWidth
                      required
                      value={exp.title}
                      onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Organization/School"
                      fullWidth
                      required
                      value={exp.organization}
                      onChange={(e) => handleExperienceChange(index, 'organization', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Location"
                      fullWidth
                      value={exp.location}
                      onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Start Date"
                      type="date"
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                      value={exp.startDate}
                      onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="End Date (or leave blank if current)"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={exp.endDate}
                      onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      fullWidth
                      multiline
                      rows={3}
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      helperText="Describe your responsibilities and achievements"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={addExperience}
            sx={{ mb: 4 }}
          >
            Add Another Experience
          </Button>
          
          {/* Certifications */}
          <Typography variant="h6" gutterBottom>
            Certifications
          </Typography>
          
          {certifications.map((cert, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">Certification #{index + 1}</Typography>
                  
                  <IconButton 
                    color="error" 
                    onClick={() => removeCertification(index)}
                    disabled={certifications.length <= 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Certificate Name"
                      fullWidth
                      required
                      value={cert.name}
                      onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Issuing Organization"
                      fullWidth
                      required
                      value={cert.issuingOrganization}
                      onChange={(e) => handleCertificationChange(index, 'issuingOrganization', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Issue Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={cert.date}
                      onChange={(e) => handleCertificationChange(index, 'date', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Credential ID (optional)"
                      fullWidth
                      value={cert.credentialId}
                      onChange={(e) => handleCertificationChange(index, 'credentialId', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={addCertification}
            sx={{ mb: 4 }}
          >
            Add Another Certification
          </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
            >
              Back
            </Button>
            
            <Box>
              <Button
                variant="text"
                onClick={handleSkip}
                disabled={loading}
                sx={{ mr: 2 }}
              >
                Skip
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Next: Video Upload'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Experience;
