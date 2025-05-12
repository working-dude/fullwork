import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { SentimentVeryDissatisfied as SadIcon } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 5, mt: 5, textAlign: 'center' }}>
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 5
          }}
        >
          <SadIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 3 }} />
          
          <Typography variant="h2" component="h1" gutterBottom>
            404
          </Typography>
          
          <Typography variant="h4" component="h2" gutterBottom>
            Page Not Found
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500, mb: 4 }}>
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/"
              size="large"
            >
              Go to Homepage
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => window.history.back()}
              size="large"
            >
              Go Back
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;
