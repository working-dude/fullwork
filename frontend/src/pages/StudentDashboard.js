import React, { useEffect, useState } from 'react';
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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  Book as BookIcon,
  VideoLibrary as VideoIcon
} from '@mui/icons-material';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { student } = useAuth();
  const navigate = useNavigate();
  
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch upcoming classes
        // const classesResponse = await api.get('/api/student/upcoming-classes');
        // setUpcomingClasses(classesResponse.data);
        
        // Fetch enrolled courses
        console.log('Fetching enrolled courses for student:', student?._id);
        const coursesResponse = await api.get(`/api/student/registered-classes/${student?._id}`);
        setEnrolledCourses(coursesResponse.data);
        
        // Fetch course recommendations
        // const recommendationsResponse = await api.get('/api/student/recommendations');
        // setRecommendations(recommendationsResponse.data);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {student?.name || 'Student'}
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/student-calendar')}
          startIcon={<CalendarIcon />}
        >
          My Calendar
        </Button>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Upcoming Classes */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              minHeight: 240,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Upcoming Classes
              </Typography>
              
              <Button 
                size="small" 
                color="primary"
                onClick={() => navigate('/class-registration')}
              >
                Register New Class
              </Button>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {upcomingClasses.length > 0 ? (
              <List sx={{ flexGrow: 1 }}>
                {upcomingClasses.map((classItem) => (
                  <ListItem key={classItem._id} divider>
                    <ListItemIcon>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={classItem.title}
                      secondary={`${formatDateTime(classItem.startTime)} • ${classItem.tutorName}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  No upcoming classes. Register for a class to get started.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Enrolled Courses */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              minHeight: 240,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              My Courses
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            {enrolledCourses.length > 0 ? (
              <List sx={{ flexGrow: 1 }}>
                {enrolledCourses.map((course) => (
                  <ListItem key={course._id} divider>
                    <ListItemIcon>
                      <BookIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={course.title}
                      secondary={`Tutor: ${course.tutorName} • Progress: ${course.progress || '0'}%`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  You are not enrolled in any courses yet.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Recommended Courses */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Recommended Courses
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {recommendations.length > 0 ? (
                recommendations.map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course._id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="div">
                          {course.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Tutor: {course.tutorName}
                        </Typography>
                        <Typography variant="body2">
                          {course.description.substring(0, 100)}...
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="primary">
                          View Details
                        </Button>
                        <Button size="small" color="primary">
                          Enroll
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
                    <Typography variant="body2" color="textSecondary">
                      No course recommendations available at this time.
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
