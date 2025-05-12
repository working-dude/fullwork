const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');
const Booking = require('../models/Booking');
const { authenticateJWT } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Student Registration Route
router.post('/register', [
  check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  console.log(req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, ...studentData } = req.body;

  try {
    // Check for existing username
    const existingStudent = await Student.findOne({ username });
    if (existingStudent) {
      return res.status(400).json({ 
        message: 'Username already exists'
      });
    }

    const newStudent = new Student({
      username,
      password,
      ...studentData
    });

    await newStudent.save();
    
    // Create JWT token for immediate login
    const accessToken = jwt.sign(
      { id: newStudent._id, username: newStudent.username, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      message: 'Student registered successfully',
      accessToken,
      student: {
        id: newStudent._id,
        username: newStudent.username,
        name: newStudent.name,
        localLanguage: newStudent.localLanguage,   
        motherLanguage: newStudent.motherLanguage, 
        currentLocation: newStudent.currentLocation,
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Student Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Access token (1h expiry)
    const accessToken = jwt.sign(
      {
        id: student._id,
        username: student.username,
        role: 'student',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Refresh token (7d expiry)
    const refreshToken = jwt.sign(
      { id: student._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token to database
    student.refreshToken = refreshToken;
    await student.save();

    // Respond with minimal and relevant student info
    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      student: {
        _id: student._id,
        username: student.username,
        name: student.name,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Token Refresh Route
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const student = await Student.findById(decoded.id);
    
    if (!student || student.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate a new access token
    const accessToken = jwt.sign(
      { id: student._id, username: student.username, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ accessToken, refreshToken });

  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(500).json({ message: 'Server error during token refresh' });
  }
});

// Logout Route
router.post('/logout', async (req, res) => {
  try {
    const { studentId } = req.body; 
    const student = await Student.findById(studentId);
    
    if (student) {
      student.refreshToken = null;  // Clear the refresh token on logout
      await student.save();
      res.status(200).json({ message: 'Logged out successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

// Get student profile
router.get('/profile', async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: 'Missing studentId' });
    }

    const student = await Student.findById(studentId).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search Tutors Route
router.post('/search-tutors', async (req, res) => {
  const { course, language, location } = req.body;

  try {
    console.log('Searching tutors with:', { course, language, location });

    // Normalize inputs for case-insensitive matching
    const courseRegex = typeof course === 'string' ? new RegExp(course, 'i') : /.*/;
    const languageStr = typeof language === 'string' ? language.toLowerCase() : '';
    const locationStr = typeof location === 'string' ? location.toLowerCase() : '';

    // Find tutors that match criteria
    const tutors = await Tutor.find({});
    
    // Filter results
    const filteredTutors = tutors.filter(tutor => {
      // Check if tutor has the course
      const hasCourse = !course || tutor.subjects.some(subject => subject.subject.match(courseRegex));
      
      // Check if tutor speaks the language
      const hasLanguage = !language || 
        (tutor.subjects.some(subject => 
          subject.language && subject.language.some(lang => lang.toLowerCase().includes(languageStr))
        ));
      
      // Check if tutor is in the location
      const hasLocation = !location || 
        (tutor.city && tutor.city.toLowerCase().includes(locationStr)) || 
        (tutor.state && tutor.state.toLowerCase().includes(locationStr));
      
      return hasCourse && hasLanguage && hasLocation;
    });

    // Format response
    const formattedTutors = filteredTutors.map(tutor => ({
      _id: tutor._id,
      name: tutor.name,
      subjects: tutor.subjects,
      location: `${tutor.city}, ${tutor.state}`,
      languages: tutor.subjects.reduce((acc, subject) => {
        if (subject.language) {
          subject.language.forEach(lang => {
            if (!acc.includes(lang)) acc.push(lang);
          });
        }
        return acc;
      }, [])
    }));

    res.json({
      count: formattedTutors.length,
      tutors: formattedTutors
    });
  } catch (error) {
    console.error('Error searching tutors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book Trial Class Route
router.post('/book-trial-class', async (req, res) => {
  const { tutorId, studentId } = req.body;

  try {
    const student = await Student.findById(studentId);

    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Trial class booking logic here
    res.status(200).json({ message: 'Trial class booked successfully!' });
  } catch (error) {
    console.error('Error booking trial class:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Tutors Route
router.get('/all-tutors', async (req, res) => {
  try {
    const tutors = await Tutor.find({});
    res.status(200).json(tutors);
  } catch (error) {
    console.error('Error fetching all tutors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to handle class booking
router.post('/book-class', authenticateJWT, async (req, res) => {
  const { tutorId, classTime, trialClass } = req.body;
  const studentId = req.body.studentId;

  try {
    // Check if there's already a booking at the same time
    const existingBooking = await Booking.findOne({ studentId, classTime });
    if (existingBooking) {
      return res.status(400).json({ message: 'You already have a class booked at this time.' });
    }

    // Create new booking
    const newBooking = new Booking({
      tutorId,
      studentId,
      classTime,
      trialClass,
    });

    await newBooking.save();

    res.status(201).json({
      message: 'Class booked successfully!',
      booking: newBooking,
    });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ message: 'Error saving booking. Please try again later.' });
  }
});

// Get registered classes for a student
router.get('/registered-classes/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId) {
      return res.status(400).json({ message: 'Missing student ID' });
    }

    // Fetch bookings with tutor information
    const bookings = await Booking.find({ studentId })
      .populate('tutorId', 'name location languages courses')
      .sort({ classTime: 1 })
      .lean();

    // Format response data
    const registeredClasses = bookings.map(booking => ({
      id: booking._id,
      classTime: booking.classTime,
      status: booking.status,
      trialClass: booking.trialClass,
      classLink: booking.classLink,
      tutor: booking.tutorId || { name: 'Unknown Tutor' }
    }));

    res.status(200).json({ 
      count: registeredClasses.length,
      registeredClasses 
    });
  } catch (error) {
    console.error('Error fetching registered classes:', error);
    res.status(500).json({ message: 'Server error fetching registered classes.' });
  }
});

module.exports = router;
