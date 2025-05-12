import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box,
  Button, 
  Grid, 
  Card, 
  CardContent,
  CircularProgress,
  Alert,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// Calendar date cell styling
const CalendarDate = styled(Box)(({ theme, isCurrentMonth, isToday, hasClasses, isSelected }) => ({
  width: '100%',
  height: '100%',
  cursor: 'pointer',
  border: isToday ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  minHeight: 90,
  backgroundColor: isSelected 
    ? theme.palette.primary.light 
    : isCurrentMonth 
      ? '#fff' 
      : '#f5f5f5',
  color: isSelected 
    ? theme.palette.primary.contrastText 
    : isCurrentMonth 
      ? theme.palette.text.primary 
      : theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

// Event indicator
const EventIndicator = styled('div')(({ theme }) => ({
  width: 8,
  height: 8,
  backgroundColor: theme.palette.secondary.main,
  borderRadius: '50%',
  margin: '2px',
  display: 'inline-block'
}));

const StudentCalendar = () => {
  const { student } = useAuth();
  const navigate = useNavigate();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [classes, setClasses] = useState([]);
  const [dailyClasses, setDailyClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // Generate calendar days for the current month view
  useEffect(() => {
    const generateCalendarDays = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // First day of the month
      const firstDayOfMonth = new Date(year, month, 1);
      // Last day of the month
      const lastDayOfMonth = new Date(year, month + 1, 0);
      
      // Day of the week of the first day (0 = Sunday, 6 = Saturday)
      const firstDayOfWeek = firstDayOfMonth.getDay();
      
      // Days from previous month to show
      const daysFromPrevMonth = firstDayOfWeek;
      
      // Days from next month to show
      const totalDaysToShow = 42; // 6 rows of 7 days
      const daysFromNextMonth = totalDaysToShow - lastDayOfMonth.getDate() - daysFromPrevMonth;
      
      // Generate days array
      const days = [];
      
      // Add days from previous month
      const prevMonth = new Date(year, month, 0);
      const prevMonthLastDay = prevMonth.getDate();
      
      for (let i = prevMonthLastDay - daysFromPrevMonth + 1; i <= prevMonthLastDay; i++) {
        days.push({
          date: new Date(year, month - 1, i),
          isCurrentMonth: false,
          hasClasses: false
        });
      }
      
      // Add days from current month
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const date = new Date(year, month, i);
        days.push({
          date,
          isCurrentMonth: true,
          isToday: isSameDay(date, new Date()),
          hasClasses: false
        });
      }
      
      // Add days from next month
      for (let i = 1; i <= daysFromNextMonth; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false,
          hasClasses: false
        });
      }
      
      return days;
    };
    
    const days = generateCalendarDays();
    setCalendarDays(days);
  }, [currentDate]);

  // Fetch classes for the calendar
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/student/classes');
        setClasses(response.data);
        
        // Update calendar days with class information
        updateCalendarWithClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setError('Failed to load classes data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClasses();
  }, [calendarDays]);
  
  // Update calendar days with class information
  const updateCalendarWithClasses = (classesData) => {
    setCalendarDays(prevDays => {
      return prevDays.map(day => {
        const hasClasses = classesData.some(classItem => 
          isSameDay(new Date(classItem.startTime), day.date)
        );
        return { ...day, hasClasses };
      });
    });
  };
  
  // Check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };
  
  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    
    // Filter classes for selected date
    const filtered = classes.filter(classItem => 
      isSameDay(new Date(classItem.startTime), date)
    );
    
    setDailyClasses(filtered);
  };
  
  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
    
    // Filter classes for today
    const todayClasses = classes.filter(classItem => 
      isSameDay(new Date(classItem.startTime), today)
    );
    
    setDailyClasses(todayClasses);
  };
  
  // Format class time
  const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Dialog handlers
  const handleOpenDialog = (classItem) => {
    setSelectedClass(classItem);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleCancelClass = async () => {
    try {
      await api.post(`/student/cancel-class/${selectedClass._id}`);
      // Update classes list
      setClasses(classes.filter(c => c._id !== selectedClass._id));
      setDailyClasses(dailyClasses.filter(c => c._id !== selectedClass._id));
      handleCloseDialog();
    } catch (error) {
      console.error('Error canceling class:', error);
      setError('Failed to cancel class. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Calendar
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Calendar Controls */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}
            >
              <Button onClick={handlePrevMonth}>&lt; Prev</Button>
              
              <Typography variant="h6">
                {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </Typography>
              
              <Box>
                <Button onClick={handleTodayClick} sx={{ mr: 1 }}>Today</Button>
                <Button onClick={handleNextMonth}>Next &gt;</Button>
              </Box>
            </Box>
            
            {/* Calendar Header - Days of Week */}
            <Grid container spacing={0}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Grid item xs={12/7} key={day} sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {day}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            
            {/* Calendar Days */}
            <Grid container spacing={1}>
              {calendarDays.map((day, index) => (
                <Grid item xs={12/7} key={index}>
                  <CalendarDate 
                    isCurrentMonth={day.isCurrentMonth}
                    isToday={day.isToday}
                    hasClasses={day.hasClasses}
                    isSelected={isSameDay(day.date, selectedDate)}
                    onClick={() => handleDateSelect(day.date)}
                  >
                    <Typography 
                      variant="body2"
                      fontWeight={day.isToday ? 'bold' : 'normal'}
                    >
                      {day.date.getDate()}
                    </Typography>
                    
                    {day.hasClasses && (
                      <Box sx={{ mt: 1 }}>
                        <EventIndicator />
                      </Box>
                    )}
                  </CalendarDate>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Paper>
      
      {/* Daily Schedule */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </Typography>
        
        {dailyClasses.length > 0 ? (
          <Grid container spacing={2}>
            {dailyClasses.map((classItem) => (
              <Grid item xs={12} md={6} key={classItem._id}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {classItem.title}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Time: {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tutor: {classItem.tutorName}
                      </Typography>
                      {classItem.language && (
                        <Typography variant="body2" color="text.secondary">
                          Language: {classItem.language}
                        </Typography>
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button 
                        size="small" 
                        variant="contained"
                        disabled={new Date() > new Date(classItem.startTime)}
                      >
                        Join Class
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error"
                        onClick={() => handleOpenDialog(classItem)}
                        disabled={new Date() > new Date(classItem.startTime)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No classes scheduled for this day.
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/class-registration')}
            >
              Register for a Class
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* Cancel Class Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Cancel Class</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your class "{selectedClass?.title}" scheduled for{' '}
            {selectedClass?.startTime && new Date(selectedClass.startTime).toLocaleDateString()} at{' '}
            {selectedClass?.startTime && formatTime(selectedClass.startTime)}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>No, Keep It</Button>
          <Button onClick={handleCancelClass} color="error">
            Yes, Cancel Class
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentCalendar;
