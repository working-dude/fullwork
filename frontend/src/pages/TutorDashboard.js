import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  VideoLibrary as VideoIcon,
  AddCircleOutline as AddIcon
} from '@mui/icons-material';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const TutorDashboard = () => {
  const { tutor } = useAuth();
  const navigate = useNavigate();
  
  const [tabValue, setTabValue] = useState(0);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch upcoming classes
        const classesResponse = await api.get('/tutor/upcoming-classes');
        setUpcomingClasses(classesResponse.data);
        
        // Fetch students
        const studentsResponse = await api.get('/tutor/students');
        setStudents(studentsResponse.data);
        
        // Fetch courses
        const coursesResponse = await api.get('/tutor/courses');
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    const date = new Date(dateTimeStr);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  Welcome, {tutor?.firstName || 'Tutor'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/teacher/CourseManagement')}
              >
                Add New Course
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Stats Overview */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon sx={{ color: 'primary.main', fontSize: 40, mr: 2 }} />
              <Box>
                <Typography component="h2" variant="h5">
                  {upcomingClasses.length}
                </Typography>
                <Typography color="text.secondary">
                  Upcoming Classes
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ color: 'secondary.main', fontSize: 40, mr: 2 }} />
              <Box>
                <Typography component="h2" variant="h5">
                  {students.length}
                </Typography>
                <Typography color="text.secondary">
                  Total Students
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ color: 'success.main', fontSize: 40, mr: 2 }} />
              <Box>
                <Typography component="h2" variant="h5">
                  {courses.length}
                </Typography>
                <Typography color="text.secondary">
                  Active Courses
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Upcoming Classes" />
              <Tab label="My Students" />
              <Tab label="My Courses" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
              
              {/* Upcoming Classes Tab */}
              {tabValue === 0 && (
                <Box>
                  {upcomingClasses.length > 0 ? (
                    <List>
                      {upcomingClasses.map((classItem) => (
                        <React.Fragment key={classItem._id}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar>
                                <ScheduleIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={classItem.title}
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    sx={{ display: 'block' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {formatDateTime(classItem.startTime)}
                                  </Typography>
                                  Student: {classItem.studentName}
                                </React.Fragment>
                              }
                            />
                            <Button size="small" variant="outlined">
                              Start Class
                            </Button>
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                      No upcoming classes scheduled.
                    </Typography>
                  )}
                </Box>
              )}
              
              {/* Students Tab */}
              {tabValue === 1 && (
                <Box>
                  {students.length > 0 ? (
                    <Grid container spacing={2}>
                      {students.map((student) => (
                        <Grid item xs={12} sm={6} md={4} key={student._id}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ mr: 2 }}>
                                  {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                                </Avatar>
                                <Typography variant="h6" component="div">
                                  {student.name}
                                </Typography>
                              </Box>
                              
                              <Typography color="text.secondary" gutterBottom>
                                Enrolled since: {new Date(student.enrollmentDate).toLocaleDateString()}
                              </Typography>
                              
                              <Typography variant="body2">
                                Classes completed: {student.classesCompleted || 0}
                              </Typography>
                              
                              <Box sx={{ mt: 2 }}>
                                {student.enrolledCourses?.map((course) => (
                                  <Chip
                                    key={course._id}
                                    label={course.title}
                                    size="small"
                                    variant="outlined"
                                    sx={{ mr: 1, mb: 1 }}
                                  />
                                ))}
                              </Box>
                            </CardContent>
                            <CardActions>
                              <Button size="small">View Details</Button>
                              <Button size="small">Contact</Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                      You don't have any students yet.
                    </Typography>
                  )}
                </Box>
              )}
              
              {/* Courses Tab */}
              {tabValue === 2 && (
                <Box>
                  {courses.length > 0 ? (
                    <Grid container spacing={2}>
                      {courses.map((course) => (
                        <Grid item xs={12} sm={6} md={4} key={course._id}>
                          <Card>
                            <CardContent>
                              <Typography variant="h6" component="div" gutterBottom>
                                {course.title}
                              </Typography>
                              
                              <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                                <Chip 
                                  label={course.language} 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined"
                                />
                                <Chip 
                                  label={course.level} 
                                  size="small" 
                                  color="secondary" 
                                  variant="outlined"
                                />
                              </Box>
                              
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {course.description.substring(0, 100)}
                                {course.description.length > 100 ? '...' : ''}
                              </Typography>
                              
                              <Grid container spacing={1}>
                                <Grid item xs={6}>
                                  <Typography variant="body2">
                                    Duration: {course.durationInWeeks} weeks
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2">
                                    Price: ${course.pricePerClass}/class
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="body2">
                                    Enrolled Students: {course.enrolledStudents?.length || 0}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </CardContent>
                            <CardActions>
                              <Button size="small">Edit</Button>
                              <Button size="small">View Details</Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary" paragraph>
                        You haven't created any courses yet.
                      </Typography>
                      <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/teacher/CourseManagement')}
                      >
                        Create Your First Course
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TutorDashboard;
