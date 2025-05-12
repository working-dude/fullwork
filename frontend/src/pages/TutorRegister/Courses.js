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
  TextField,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const Courses = () => {
  const [courses, setCourses] = useState([
    {
      title: '',
      description: '',
      language: '',
      level: 'beginner',
      topics: [],
      durationInWeeks: 4,
      pricePerClass: 0
    }
  ]);
  
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [newTopic, setNewTopic] = useState('');
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

  const handleCourseChange = (field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[currentCourseIndex][field] = value;
    setCourses(updatedCourses);
  };

  const addTopic = () => {
    if (!newTopic.trim()) return;
    
    const updatedCourses = [...courses];
    updatedCourses[currentCourseIndex].topics = [
      ...updatedCourses[currentCourseIndex].topics,
      newTopic.trim()
    ];
    
    setCourses(updatedCourses);
    setNewTopic('');
  };

  const removeTopic = (topicIndex) => {
    const updatedCourses = [...courses];
    updatedCourses[currentCourseIndex].topics = updatedCourses[currentCourseIndex].topics.filter(
      (_, i) => i !== topicIndex
    );
    setCourses(updatedCourses);
  };

  const addNewCourse = () => {
    setCourses([
      ...courses,
      {
        title: '',
        description: '',
        language: '',
        level: 'beginner',
        topics: [],
        durationInWeeks: 4,
        pricePerClass: 0
      }
    ]);
    
    setCurrentCourseIndex(courses.length);
  };

  const selectCourse = (index) => {
    setCurrentCourseIndex(index);
  };

  const removeCourse = (index) => {
    if (courses.length <= 1) {
      setError('You must have at least one course');
      return;
    }
    
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
    
    if (currentCourseIndex >= updatedCourses.length) {
      setCurrentCourseIndex(updatedCourses.length - 1);
    }
  };

  const validateCourse = (course) => {
    if (!course.title.trim()) return 'Course title is required';
    if (!course.description.trim()) return 'Course description is required';
    if (!course.language.trim()) return 'Course language is required';
    if (!course.level) return 'Course level is required';
    if (course.topics.length === 0) return 'Add at least one topic for the course';
    if (course.durationInWeeks <= 0) return 'Course duration must be at least 1 week';
    if (course.pricePerClass <= 0) return 'Price per class must be greater than 0';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all courses
    for (let i = 0; i < courses.length; i++) {
      const courseError = validateCourse(courses[i]);
      if (courseError) {
        setError(`Course ${i + 1}: ${courseError}`);
        setCurrentCourseIndex(i);
        return;
      }
    }
    
    setError('');
    setLoading(true);
    
    try {
      const tutorId = localStorage.getItem('tutorId');
      if (!tutorId) {
        throw new Error('Registration session expired. Please start over.');
      }
      
      const response = await fetch('/api/tutor/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tutorId,
          courses
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save course information');
      }
      
      // Complete registration
      navigate('/success');
      
    } catch (error) {
      console.error('Error saving courses:', error);
      setError(error.message || 'Failed to save course information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const currentCourse = courses[currentCourseIndex];

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Course Details
        </Typography>
        
        <Stepper activeStep={5} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              My Courses
            </Typography>
            
            <List sx={{ bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
              {courses.map((course, index) => (
                <ListItem 
                  key={index} 
                  button 
                  selected={index === currentCourseIndex}
                  onClick={() => selectCourse(index)}
                  divider
                >
                  <ListItemText 
                    primary={course.title || `Course ${index + 1}`} 
                    secondary={course.language ? `${course.language}, ${course.level}` : 'No details yet'}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => removeCourse(index)}
                      disabled={courses.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addNewCourse}
              fullWidth
            >
              Add New Course
            </Button>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {currentCourse.title ? `Edit: ${currentCourse.title}` : `Course ${currentCourseIndex + 1} Details`}
                </Typography>
                
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Course Title"
                      fullWidth
                      required
                      value={currentCourse.title}
                      onChange={(e) => handleCourseChange('title', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={currentCourse.language}
                        label="Language"
                        onChange={(e) => handleCourseChange('language', e.target.value)}
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
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Level</InputLabel>
                      <Select
                        value={currentCourse.level}
                        label="Level"
                        onChange={(e) => handleCourseChange('level', e.target.value)}
                      >
                        {PROFICIENCY_LEVELS.map((level) => (
                          <MenuItem key={level.value} value={level.value}>
                            {level.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Duration (weeks)"
                      type="number"
                      fullWidth
                      required
                      InputProps={{ inputProps: { min: 1 } }}
                      value={currentCourse.durationInWeeks}
                      onChange={(e) => handleCourseChange('durationInWeeks', parseInt(e.target.value) || '')}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Price per Class"
                      type="number"
                      fullWidth
                      required
                      InputProps={{ inputProps: { min: 0 } }}
                      value={currentCourse.pricePerClass}
                      onChange={(e) => handleCourseChange('pricePerClass', parseFloat(e.target.value) || '')}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Course Description"
                      fullWidth
                      multiline
                      rows={3}
                      required
                      value={currentCourse.description}
                      onChange={(e) => handleCourseChange('description', e.target.value)}
                      helperText="Describe what students will learn in this course"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Course Topics
                    </Typography>
                    
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <TextField
                        label="Add Topic"
                        fullWidth
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                      />
                      <Button
                        sx={{ ml: 1 }}
                        variant="contained"
                        onClick={addTopic}
                        disabled={!newTopic.trim()}
                      >
                        Add
                      </Button>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {currentCourse.topics.map((topic, index) => (
                        <Chip
                          key={index}
                          label={topic}
                          onDelete={() => removeTopic(index)}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
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
            type="button"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Complete Registration'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Courses;
