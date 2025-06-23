import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ClassRegistration = () => {
  const { student } = useAuth();
  const navigate = useNavigate();
  
  const [availableClasses, setAvailableClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classConfirmation, setClassConfirmation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    tutor: '',
    language: '',
    date: '',
    timeOfDay: '' // morning, afternoon, evening
  });
  
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true);
        
        // Fetch available classes
        // const classesResponse = await api.get('/api/student/available-classes');
        // setAvailableClasses(classesResponse.data);
        // setFilteredClasses(classesResponse.data);
        
        // Fetch tutors for filtering
        const tutorsResponse = await api.get('/api/student/all-tutors');
        setTutors(tutorsResponse.data);
        
      } catch (error) {
        console.error('Error fetching class data:', error);
        setError('Failed to load available classes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClassData();
  }, []);
  
  // Apply filters
  useEffect(() => {
    let result = [...availableClasses];
    
    if (filters.tutor) {
      result = result.filter(cls => cls.tutorId === filters.tutor);
    }
    
    if (filters.language) {
      result = result.filter(cls => cls.language === filters.language);
    }
    
    if (filters.date) {
      const selectedDate = new Date(filters.date);
      selectedDate.setHours(0, 0, 0, 0);
      
      result = result.filter(cls => {
        const classDate = new Date(cls.startTime);
        classDate.setHours(0, 0, 0, 0);
        return classDate.getTime() === selectedDate.getTime();
      });
    }
    
    if (filters.timeOfDay) {
      result = result.filter(cls => {
        const hour = new Date(cls.startTime).getHours();
        
        if (filters.timeOfDay === 'morning') {
          return hour >= 5 && hour < 12;
        } else if (filters.timeOfDay === 'afternoon') {
          return hour >= 12 && hour < 17;
        } else if (filters.timeOfDay === 'evening') {
          return hour >= 17 && hour < 22;
        }
        return true;
      });
    }
    
    setFilteredClasses(result);
  }, [filters, availableClasses]);
  
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      tutor: '',
      language: '',
      date: '',
      timeOfDay: ''
    });
  };
  
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    const date = new Date(dateTimeStr);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  const handleBookClass = async (classId) => {
    try {
      const response = await api.post('/student/book-class', {
        classId,
        studentId: student._id
      });
      
      setClassConfirmation(response.data);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error booking class:', error);
      setError('Failed to book class. Please try again.');
    }
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    
    if (classConfirmation?.success) {
      // Remove the booked class from available classes
      const updatedClasses = availableClasses.filter(
        cls => cls._id !== classConfirmation.classId
      );
      setAvailableClasses(updatedClasses);
      
      // Update filtered classes as well
      setFilteredClasses(prevFiltered => 
        prevFiltered.filter(cls => cls._id !== classConfirmation.classId)
      );
    }
  };
  
  const handleViewCalendar = () => {
    navigate('/student-calendar');
  };
  
  // Get unique languages from available classes
  const languages = [...new Set(availableClasses.map(cls => cls.language))];
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Register for Classes
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Grid container spacing={2}>
          {/* Filters */}
          <Grid item xs={12}>
            <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Filter Classes
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="tutor-filter-label">Tutor</InputLabel>
                    <Select
                      labelId="tutor-filter-label"
                      value={filters.tutor}
                      label="Tutor"
                      onChange={(e) => handleFilterChange('tutor', e.target.value)}
                    >
                      <MenuItem value="">All Tutors</MenuItem>
                      {tutors.map(tutor => (
                        <MenuItem key={tutor._id} value={tutor._id}>
                          {tutor.firstName} {tutor.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="language-filter-label">Language</InputLabel>
                    <Select
                      labelId="language-filter-label"
                      value={filters.language}
                      label="Language"
                      onChange={(e) => handleFilterChange('language', e.target.value)}
                    >
                      <MenuItem value="">All Languages</MenuItem>
                      {languages.map(language => (
                        <MenuItem key={language} value={language}>
                          {language}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Date"
                    type="date"
                    fullWidth
                    margin="normal"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="time-filter-label">Time of Day</InputLabel>
                    <Select
                      labelId="time-filter-label"
                      value={filters.timeOfDay}
                      label="Time of Day"
                      onChange={(e) => handleFilterChange('timeOfDay', e.target.value)}
                    >
                      <MenuItem value="">Any Time</MenuItem>
                      <MenuItem value="morning">Morning (5am-12pm)</MenuItem>
                      <MenuItem value="afternoon">Afternoon (12pm-5pm)</MenuItem>
                      <MenuItem value="evening">Evening (5pm-10pm)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={resetFilters}
                    sx={{ mr: 1 }}
                  >
                    Reset Filters
                  </Button>
                  
                  <Button 
                    variant="outlined"
                    onClick={handleViewCalendar}
                    startIcon={<EventIcon />}
                  >
                    View My Calendar
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Results */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Available Classes ({filteredClasses.length})
            </Typography>
            
            {filteredClasses.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No classes match your criteria. Try adjusting your filters.
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {filteredClasses.map((classItem) => (
                  <Grid item xs={12} md={6} lg={4} key={classItem._id}>
                    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {classItem.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {classItem.tutorName}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {formatDateTime(classItem.startTime)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <SchoolIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {classItem.language} - {classItem.level || 'All Levels'}
                          </Typography>
                        </Box>
                        
                        {classItem.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {classItem.description}
                          </Typography>
                        )}
                        
                        {classItem.price && (
                          <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                            Price: ${classItem.price.toFixed(2)}
                          </Typography>
                        )}
                      </CardContent>
                      
                      <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleBookClass(classItem._id)}
                        >
                          Book Class
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      {/* Booking Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {classConfirmation?.success ? "Class Booked Successfully!" : "Booking Failed"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {classConfirmation?.success ? (
              <>
                You have successfully booked the class. It has been added to your calendar.
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {classConfirmation.className}
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTime(classConfirmation.classTime)}
                  </Typography>
                </Box>
              </>
            ) : (
              "There was an error booking your class. Please try again."
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {classConfirmation?.success ? (
            <>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button onClick={handleViewCalendar} autoFocus>
                View Calendar
              </Button>
            </>
          ) : (
            <Button onClick={handleCloseDialog} autoFocus>
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClassRegistration;
