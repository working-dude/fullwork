import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
  Divider,
  Alert,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import api from '../utils/api';

const CourseManagement = () => {  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Course states
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New course form
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    title: '',
    description: '',
    language: '',
    level: 'beginner',
    durationInWeeks: 4,
    pricePerClass: 0,
    topics: [],
    isPublished: true
  });
  const [currentTopic, setCurrentTopic] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  
  useEffect(() => {
    fetchCourses();
  }, []);
  
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tutor/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Form handling
  const handleCourseChange = (field, value) => {
    setCurrentCourse(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error if field is being updated
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };
  
  const addTopic = () => {
    if (!currentTopic.trim()) return;
    
    setCurrentCourse(prev => ({
      ...prev,
      topics: [...prev.topics, currentTopic.trim()]
    }));
    
    setCurrentTopic('');
  };
  
  const removeTopic = (index) => {
    setCurrentCourse(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }));
  };
  
  const validateCourse = () => {
    const errors = {};
    
    if (!currentCourse.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!currentCourse.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!currentCourse.language) {
      errors.language = 'Language is required';
    }
    
    if (!currentCourse.level) {
      errors.level = 'Level is required';
    }
    
    if (currentCourse.durationInWeeks <= 0) {
      errors.durationInWeeks = 'Duration must be at least 1 week';
    }
    
    if (currentCourse.pricePerClass < 0) {
      errors.pricePerClass = 'Price must be 0 or higher';
    }
    
    if (currentCourse.topics.length === 0) {
      errors.topics = 'Add at least one topic';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleAddCourse = () => {
    setIsAddingCourse(true);
    setIsEditingCourse(false);
    setCurrentCourse({
      title: '',
      description: '',
      language: '',
      level: 'beginner',
      durationInWeeks: 4,
      pricePerClass: 0,
      topics: [],
      isPublished: true
    });
    setFormErrors({});
    setTabValue(1); // Switch to form tab
  };
  
  const handleEditCourse = (course) => {
    setIsEditingCourse(true);
    setIsAddingCourse(false);
    setCurrentCourse({
      ...course,
      topics: course.topics || []
    });
    setFormErrors({});
    setTabValue(1); // Switch to form tab
  };
  
  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/tutor/courses/${courseToDelete._id}`);
      setCourses(courses.filter(c => c._id !== courseToDelete._id));
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error('Error deleting course:', error);
      setError('Failed to delete course. Please try again.');
    }
  };
  
  const handlePublishToggle = async (course) => {
    try {
      const updatedCourse = { ...course, isPublished: !course.isPublished };
      const response = await api.put(`/tutor/courses/${course._id}`, updatedCourse);
      
      // Update courses list with the updated course
      setCourses(courses.map(c => c._id === course._id ? response.data : c));
    } catch (error) {
      console.error('Error updating course:', error);
      setError('Failed to update course. Please try again.');
    }
  };
  
  const handleSaveCourse = async () => {
    if (!validateCourse()) return;
    
    try {
      let response;
      
      if (isEditingCourse) {
        response = await api.put(`/tutor/courses/${currentCourse._id}`, currentCourse);
        setCourses(courses.map(c => c._id === currentCourse._id ? response.data : c));
      } else {
        response = await api.post('/tutor/courses', currentCourse);
        setCourses([...courses, response.data]);
      }
      
      setTabValue(0); // Switch back to list view
      setIsAddingCourse(false);
      setIsEditingCourse(false);
      
    } catch (error) {
      console.error('Error saving course:', error);
      setError('Failed to save course. Please try again.');
    }
  };
  
  const handleCancel = () => {
    setTabValue(0); // Switch back to list view
    setIsAddingCourse(false);
    setIsEditingCourse(false);
  };
  
  if (loading && courses.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Course Management
          </Typography>
          
          {tabValue === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCourse}
            >
              Add New Course
            </Button>
          )}
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="My Courses" />
          <Tab label={isEditingCourse ? "Edit Course" : "Add New Course"} disabled={!isAddingCourse && !isEditingCourse} />
        </Tabs>
        
        <Box sx={{ py: 3 }}>
          {/* Course List Tab */}
          {tabValue === 0 && (
            <>
              {courses.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    You haven't created any courses yet
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddCourse}
                    sx={{ mt: 2 }}
                  >
                    Create Your First Course
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {courses.map(course => (
                    <Grid item key={course._id} xs={12} md={6} lg={4}>
                      <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="h6" component="div" gutterBottom>
                              {course.title}
                            </Typography>
                            <Chip 
                              label={course.isPublished ? "Published" : "Draft"} 
                              size="small"
                              color={course.isPublished ? "success" : "default"}
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LanguageIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {course.language}, {course.level}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ScheduleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {course.durationInWeeks} weeks, ${course.pricePerClass}/class
                            </Typography>
                          </Box>
                          
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              mt: 1,
                              mb: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {course.description}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {course.topics && course.topics.map((topic, index) => (
                              <Chip
                                key={index}
                                label={topic}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        </CardContent>
                        <Divider />
                        <CardActions>
                          <Button 
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditCourse(course)}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="small"
                            startIcon={course.isPublished ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            onClick={() => handlePublishToggle(course)}
                          >
                            {course.isPublished ? 'Unpublish' : 'Publish'}
                          </Button>
                          <Button 
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteClick(course)}
                          >
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
          
          {/* Course Form Tab */}
          {tabValue === 1 && (
            <Box component="form">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Course Title"
                    fullWidth
                    required
                    value={currentCourse.title}
                    onChange={(e) => handleCourseChange('title', e.target.value)}
                    error={!!formErrors.title}
                    helperText={formErrors.title}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!formErrors.language}>
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
                    {formErrors.language && <FormHelperText>{formErrors.language}</FormHelperText>}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!formErrors.level}>
                    <InputLabel>Level</InputLabel>
                    <Select
                      value={currentCourse.level}
                      label="Level"
                      onChange={(e) => handleCourseChange('level', e.target.value)}
                    >
                      <MenuItem value="beginner">Beginner</MenuItem>
                      <MenuItem value="intermediate">Intermediate</MenuItem>
                      <MenuItem value="advanced">Advanced</MenuItem>
                    </Select>
                    {formErrors.level && <FormHelperText>{formErrors.level}</FormHelperText>}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Published Status</InputLabel>
                    <Select
                      value={currentCourse.isPublished}
                      label="Published Status"
                      onChange={(e) => handleCourseChange('isPublished', e.target.value)}
                    >
                      <MenuItem value={true}>Published</MenuItem>
                      <MenuItem value={false}>Draft</MenuItem>
                    </Select>
                    <FormHelperText>
                      Published courses are visible to students
                    </FormHelperText>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Duration (weeks)"
                    fullWidth
                    required
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    value={currentCourse.durationInWeeks}
                    onChange={(e) => handleCourseChange('durationInWeeks', parseInt(e.target.value, 10) || '')}
                    error={!!formErrors.durationInWeeks}
                    helperText={formErrors.durationInWeeks}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price per Class"
                    fullWidth
                    required
                    type="number"
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                    value={currentCourse.pricePerClass}
                    onChange={(e) => handleCourseChange('pricePerClass', parseFloat(e.target.value) || 0)}
                    error={!!formErrors.pricePerClass}
                    helperText={formErrors.pricePerClass}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Course Description"
                    fullWidth
                    required
                    multiline
                    rows={4}
                    value={currentCourse.description}
                    onChange={(e) => handleCourseChange('description', e.target.value)}
                    error={!!formErrors.description}
                    helperText={formErrors.description || "Describe what students will learn in this course"}
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
                      value={currentTopic}
                      onChange={(e) => setCurrentTopic(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                      error={!!formErrors.topics}
                      helperText={formErrors.topics}
                    />
                    <Button
                      sx={{ ml: 1 }}
                      variant="contained"
                      onClick={addTopic}
                      disabled={!currentTopic.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                  
                  <Paper variant="outlined" sx={{ p: 2, mt: 1, mb: 3, minHeight: '100px' }}>
                    {currentCourse.topics.length === 0 ? (
                      <Typography color="text.secondary" align="center">
                        No topics added yet
                      </Typography>
                    ) : (
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
                    )}
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSaveCourse}
                    >
                      {isEditingCourse ? 'Update Course' : 'Create Course'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseManagement;
