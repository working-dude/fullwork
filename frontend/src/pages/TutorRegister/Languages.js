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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  TextField,
  Rating,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'native', label: 'Native' }
];

const Languages = () => {
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [teachingLanguages, setTeachingLanguages] = useState([
    { language: '', proficiency: 'native', yearsOfExperience: 0 }
  ]);
  
  const [newLanguage, setNewLanguage] = useState('');
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

  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = [...teachingLanguages];
    updatedLanguages[index][field] = value;
    setTeachingLanguages(updatedLanguages);
  };

  const addLanguage = () => {
    if (!newLanguage.trim()) return;
    
    // Check if language already exists
    if (teachingLanguages.some(lang => lang.language.toLowerCase() === newLanguage.toLowerCase())) {
      setError(`${newLanguage} is already in your teaching languages`);
      return;
    }
    
    setTeachingLanguages([
      ...teachingLanguages,
      { language: newLanguage, proficiency: 'intermediate', yearsOfExperience: 0 }
    ]);
    
    setNewLanguage('');
    setError('');
  };

  const removeLanguage = (index) => {
    // Keep at least one language
    if (teachingLanguages.length <= 1) {
      setError('You must have at least one teaching language');
      return;
    }
    
    const updatedLanguages = teachingLanguages.filter((_, i) => i !== index);
    setTeachingLanguages(updatedLanguages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const emptyLanguages = teachingLanguages.filter(lang => !lang.language.trim());
    if (emptyLanguages.length > 0) {
      setError('Please fill in all language fields or remove empty ones');
      return;
    }
    
    if (!nativeLanguage) {
      setError('Please select your native language');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const tutorId = localStorage.getItem('tutorId');
      if (!tutorId) {
        throw new Error('Registration session expired. Please start over.');
      }
      
      const response = await fetch('/api/tutor/languages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tutorId,
          nativeLanguage,
          teachingLanguages
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save language information');
      }
      
      // Move to next step in registration process
      navigate('/experience');
      
    } catch (error) {
      console.error('Error saving languages:', error);
      setError(error.message || 'Failed to save language information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Languages
        </Typography>
        
        <Stepper activeStep={2} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          {/* Native Language */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="native-language-label">Native Language</InputLabel>
            <Select
              labelId="native-language-label"
              value={nativeLanguage}
              label="Native Language"
              onChange={(e) => setNativeLanguage(e.target.value)}
            >
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Spanish">Spanish</MenuItem>
              <MenuItem value="French">French</MenuItem>
              <MenuItem value="German">German</MenuItem>
              <MenuItem value="Chinese">Chinese</MenuItem>
              <MenuItem value="Japanese">Japanese</MenuItem>
              <MenuItem value="Korean">Korean</MenuItem>
              <MenuItem value="Russian">Russian</MenuItem>
              <MenuItem value="Arabic">Arabic</MenuItem>
              <MenuItem value="Hindi">Hindi</MenuItem>
              <MenuItem value="Portuguese">Portuguese</MenuItem>
              <MenuItem value="Italian">Italian</MenuItem>
            </Select>
          </FormControl>

          {/* Teaching Languages */}
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Languages You Can Teach
          </Typography>
          
          {teachingLanguages.map((lang, index) => (
            <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Language"
                  fullWidth
                  required
                  value={lang.language}
                  onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth required>
                  <InputLabel>Proficiency</InputLabel>
                  <Select
                    value={lang.proficiency}
                    label="Proficiency"
                    onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                  >
                    {PROFICIENCY_LEVELS.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Years of Experience"
                  type="number"
                  fullWidth
                  required
                  InputProps={{ inputProps: { min: 0 } }}
                  value={lang.yearsOfExperience}
                  onChange={(e) => handleLanguageChange(index, 'yearsOfExperience', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton 
                  color="error" 
                  onClick={() => removeLanguage(index)}
                  disabled={teachingLanguages.length <= 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          
          {/* Add New Language */}
          <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <Grid item xs>
              <TextField
                label="Add New Language"
                fullWidth
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={addLanguage}
                        edge="end"
                        color="primary"
                        disabled={!newLanguage.trim()}
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
            >
              Back
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Next: Teaching Experience'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Languages;
