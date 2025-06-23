import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  IconButton,
  Divider
} from '@mui/material';
import {
  School,
  VideoLibrary,
  People,
  Assignment,
  TrendingUp,
  Add,
  Edit,
  Delete,
  Visibility,
  Star,
  Message,
  Upload,
  Schedule,
  MonetizationOn
} from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tutor-tabpanel-${index}`}
      aria-labelledby={`tutor-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TutorDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Mock data - replace with real API calls
  const [tutorData, setTutorData] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@edu.com',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    totalStudents: 156,
    totalVideos: 24,
    totalEarnings: 5420,
    rating: 4.8,
    joinedDate: '2023-01-15'
  });

  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'Introduction to Calculus',
      subject: 'Mathematics',
      duration: '45:30',
      views: 1230,
      uploadDate: '2024-01-15',
      status: 'Published'
    },
    {
      id: 2,
      title: 'Quantum Physics Basics',
      subject: 'Physics',
      duration: '38:15',
      views: 890,
      uploadDate: '2024-01-12',
      status: 'Published'
    },
    {
      id: 3,
      title: 'Organic Chemistry Reactions',
      subject: 'Chemistry',
      duration: '52:40',
      views: 756,
      uploadDate: '2024-01-10',
      status: 'Draft'
    }
  ]);

  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Alice Smith',
      email: 'alice@student.com',
      enrolledCourses: 3,
      progress: 85,
      lastActive: '2024-01-20'
    },
    {
      id: 2,
      name: 'Bob Johnson',
      email: 'bob@student.com',
      enrolledCourses: 2,
      progress: 72,
      lastActive: '2024-01-19'
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol@student.com',
      enrolledCourses: 4,
      progress: 93,
      lastActive: '2024-01-21'
    }
  ]);

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Calculus Problem Set 1',
      subject: 'Mathematics',
      dueDate: '2024-01-25',
      submissions: 23,
      totalStudents: 30,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Physics Lab Report',
      subject: 'Physics',
      dueDate: '2024-01-28',
      submissions: 15,
      totalStudents: 25,
      status: 'Active'
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUploadVideo = () => {
    // Mock video upload - replace with real API call
    if (newVideoTitle && selectedFile) {
      const newVideo = {
        id: videos.length + 1,
        title: newVideoTitle,
        subject: 'General',
        duration: '00:00',
        views: 0,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Processing'
      };
      setVideos([...videos, newVideo]);
      setNewVideoTitle('');
      setSelectedFile(null);
      setUploadDialog(false);
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Tutor Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back, {tutorData.name}! Here's your teaching overview.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={tutorData.totalStudents}
            icon={<People sx={{ fontSize: 40 }} />}
            subtitle="Active enrollments"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Videos Created"
            value={tutorData.totalVideos}
            icon={<VideoLibrary sx={{ fontSize: 40 }} />}
            subtitle="Published content"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Earnings"
            value={`$${tutorData.totalEarnings}`}
            icon={<MonetizationOn sx={{ fontSize: 40 }} />}
            subtitle="This month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Rating"
            value={tutorData.rating}
            icon={<Star sx={{ fontSize: 40 }} />}
            subtitle="Student feedback"
          />
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="tutor dashboard tabs">
            <Tab label="Overview" />
            <Tab label="My Videos" />
            <Tab label="Students" />
            <Tab label="Assignments" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>Recent Activity</Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <VideoLibrary />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="New video uploaded: Introduction to Calculus"
                    secondary="2 hours ago"
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <Assignment />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Assignment submitted by 15 students"
                    secondary="4 hours ago"
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <People />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="3 new students enrolled in Physics course"
                    secondary="1 day ago"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom>Quick Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Upload />}
                  onClick={() => setUploadDialog(true)}
                  size="large"
                >
                  Upload New Video
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Assignment />}
                  size="large"
                >
                  Create Assignment
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Schedule />}
                  size="large"
                >
                  Schedule Class
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Videos Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">My Videos</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setUploadDialog(true)}
            >
              Upload Video
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Views</TableCell>
                  <TableCell>Upload Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>{video.title}</TableCell>
                    <TableCell>{video.subject}</TableCell>
                    <TableCell>{video.duration}</TableCell>
                    <TableCell>{video.views}</TableCell>
                    <TableCell>{video.uploadDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={video.status}
                        color={video.status === 'Published' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small"><Visibility /></IconButton>
                      <IconButton size="small"><Edit /></IconButton>
                      <IconButton size="small"><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Students Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h5" gutterBottom>My Students</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Enrolled Courses</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Last Active</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.enrolledCourses}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <div style={{
                            width: '100px',
                            height: '6px',
                            backgroundColor: '#e0e0e0',
                            borderRadius: '3px'
                          }}>
                            <div style={{
                              width: `${student.progress}%`,
                              height: '100%',
                              backgroundColor: '#1976d2',
                              borderRadius: '3px'
                            }} />
                          </div>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {student.progress}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{student.lastActive}</TableCell>
                    <TableCell>
                      <IconButton size="small"><Message /></IconButton>
                      <IconButton size="small"><Visibility /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Assignments Tab */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Assignments</Typography>
            <Button variant="contained" startIcon={<Add />}>
              Create Assignment
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Submissions</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>{assignment.subject}</TableCell>
                    <TableCell>{assignment.dueDate}</TableCell>
                    <TableCell>{assignment.submissions}/{assignment.totalStudents}</TableCell>
                    <TableCell>
                      <Chip
                        label={assignment.status}
                        color={assignment.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small"><Visibility /></IconButton>
                      <IconButton size="small"><Edit /></IconButton>
                      <IconButton size="small"><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={activeTab} index={4}>
          <Typography variant="h5" gutterBottom>Analytics & Insights</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Performance Overview
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total video views this month: 3,876
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average rating: {tutorData.rating}/5.0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Student completion rate: 89%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Feedback
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Excellent explanation of complex concepts!"
                        secondary="- Alice Smith"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Very helpful video on quantum physics."
                        secondary="- Bob Johnson"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Upload Video Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload New Video</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Video Title"
            fullWidth
            variant="outlined"
            value={newVideoTitle}
            onChange={(e) => setNewVideoTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
          >
            Choose Video File
            <input
              type="file"
              hidden
              accept="video/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </Button>
          {selectedFile && (
            <Typography variant="body2" color="text.secondary">
              Selected: {selectedFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button onClick={handleUploadVideo} variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TutorDashboard;
