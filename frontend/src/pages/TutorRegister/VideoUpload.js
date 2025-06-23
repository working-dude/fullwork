import { useState, useRef } from 'react';
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
  LinearProgress,
  Card,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import api from '../../utils/api';

const VideoUpload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoLanguage, setVideoLanguage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file');
      return;
    }
    
    // Check file size (limit to 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('Video file size should be less than 100MB');
      return;
    }
    
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setError('');
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!videoFile) {
      setError('Please upload a video');
      return;
    }
    
    if (!videoTitle.trim()) {
      setError('Please enter a video title');
      return;
    }
    
    if (!videoLanguage) {
      setError('Please select the language of your video');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const tutorId = localStorage.getItem('tutorId');
      if (!tutorId) {
        throw new Error('Registration session expired. Please start over.');
      }
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('tutorId', tutorId);
      formData.append('title', videoTitle);
      formData.append('description', videoDescription);
      formData.append('language', videoLanguage);
      
      // Upload video with progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/tutor/upload-video', true);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          // Successfully uploaded
          navigate('/courses');
        } else {
          throw new Error('Failed to upload video');
        }
      };
      
      xhr.onerror = () => {
        throw new Error('Network error occurred while uploading');
      };
      
      xhr.send(formData);
      
    } catch (error) {
      console.error('Error uploading video:', error);
      setError(error.message || 'Failed to upload video. Please try again.');
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSkip = () => {
    // Skip video upload and go to next step
    navigate('/courses');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Upload Introduction Video
        </Typography>
        
        <Stepper activeStep={4} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Typography variant="body1" paragraph>
          Please create a 2-3 minute video introducing yourself and showcasing your teaching style.
          This helps students get to know you better and increases your chances of being selected.
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: videoFile ? 'transparent' : '#f5f5f5',
                border: videoFile ? '1px solid #e0e0e0' : '2px dashed #bdbdbd'
              }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                
                {!videoFile ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 4
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Upload your introduction video
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="center" paragraph>
                      Accepted formats: MP4, MOV, AVI, etc. (Max file size: 100MB)
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={triggerFileInput}
                      sx={{ mt: 2 }}
                    >
                      Choose Video File
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Video Preview:
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <video 
                        controls 
                        width="100%" 
                        height="auto" 
                        src={videoPreview}
                        style={{ maxHeight: '300px' }}
                      />
                    </Box>
                    <Typography variant="body2">
                      File: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        onClick={triggerFileInput}
                      >
                        Change Video
                      </Button>
                    </Box>
                  </Box>
                )}
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Video Title"
                fullWidth
                required
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                helperText="A descriptive title for your introduction video"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="video-language-label">Video Language</InputLabel>
                <Select
                  labelId="video-language-label"
                  value={videoLanguage}
                  label="Video Language"
                  onChange={(e) => setVideoLanguage(e.target.value)}
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
            
            <Grid item xs={12}>
              <TextField
                label="Video Description"
                fullWidth
                multiline
                rows={4}
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                helperText="Briefly describe what you cover in your introduction video"
              />
            </Grid>
            
            {loading && (
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  Uploading: {uploadProgress}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress} 
                  sx={{ height: 8, borderRadius: 5 }} 
                />
              </Grid>
            )}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={loading}
            >
              Back
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !videoFile}
              startIcon={loading && <CircularProgress size={24} color="inherit" />}
            >
              {loading ? 'Uploading...' : 'Next: Course Details'}
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="text"
            onClick={handleSkip}
            disabled={loading}
          >
            Skip Video Upload
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default VideoUpload;
