const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tutor = require('../models/Tutor');
const { authenticateJWT, authenticateRole } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir;
    if (file.fieldname === 'profileImage') {
      uploadDir = path.join(__dirname, '..', 'uploads', 'profiles');
    } else if (file.fieldname === 'video') {
      uploadDir = path.join(__dirname, '..', 'uploads', 'videos');
    } else {
      uploadDir = path.join(__dirname, '..', 'uploads', 'documents');
    }
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'profileImage') {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
    } else if (file.fieldname === 'video') {
      if (!file.originalname.match(/\.(mp4|mov|avi|wmv)$/)) {
        return cb(new Error('Only video files are allowed!'), false);
      }
    }
    cb(null, true);
  }
});

// Tutor Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for username: ${username}`);

    const tutor = await Tutor.findOne({ username });
    if (!tutor) {
      console.log(`User not found: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, tutor.password);
    console.log(`Password comparison result: ${isMatch}`);

    if (!isMatch) {
      console.log(`Password mismatch for user: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const tutorInfo = tutor.toObject();
    delete tutorInfo.password;

    console.log(`Login successful for: ${username}`);
    res.status(200).json({
      message: 'Login successful',
      tutor: tutorInfo
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Tutor Registration Route
router.post('/register', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'aadhar', maxCount: 1 }
]), async (req, res) => {
  try {
    const { username, password, name, email, city, state } = req.body;
    
    // Check if username already exists
    const existingUsername = await Tutor.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Check if email already exists
    const existingEmail = await Tutor.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Process profile image if uploaded
    let profileImagePath = null;
    if (req.files && req.files.profileImage) {
      profileImagePath = req.files.profileImage[0].path;
    }
    
    // Process aadhar document if uploaded
    let aadharPath = null;
    if (req.files && req.files.aadhar) {
      aadharPath = req.files.aadhar[0].path;
    }
    
    // Create new tutor
    const newTutor = new Tutor({
      username,
      password,
      name,
      email,
      city,
      state,
      aadhar: aadharPath || req.body.aadhar,
      profileImage: profileImagePath
    });
    
    await newTutor.save();
    res.status(201).json({ message: 'Tutor registered successfully' });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Route for adding a video
router.post('/videos', authenticateJWT, upload.single('video'), async (req, res) => {
  try {
    const { title, description, subject, language } = req.body;
    const tutorId = req.user.id;
    
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    
    const videoPath = req.file.path;
    
    tutor.videos.push({
      title,
      description,
      path: videoPath,
      subject,
      language
    });
    
    await tutor.save();
    res.status(201).json({
      message: 'Video added successfully',
      video: tutor.videos[tutor.videos.length - 1]
    });
  } catch (error) {
    console.error('Error adding video:', error);
    res.status(500).json({ message: 'Failed to upload video' });
  }
});

// Route for adding/updating subjects
router.post('/subjects', authenticateJWT, async (req, res) => {
  try {
    const { subjects } = req.body;
    const tutorId = req.user.id;
    
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    
    // Replace existing subjects or add new ones
    if (Array.isArray(subjects)) {
      tutor.subjects = subjects;
    } else {
      return res.status(400).json({ message: 'Subjects must be an array' });
    }
    
    await tutor.save();
    res.status(200).json({
      message: 'Subjects updated successfully',
      subjects: tutor.subjects
    });
  } catch (error) {
    console.error('Error updating subjects:', error);
    res.status(500).json({ message: 'Failed to update subjects' });
  }
});

// Update personal details for tutor registration flow
router.put('/personal-details', async (req, res) => {
  try {
    const { 
      tutorId, 
      firstName, 
      lastName, 
      email, 
      phone, 
      gender, 
      dob, 
      bio, 
      country, 
      city, 
      state, 
      address, 
      aadhar 
    } = req.body;
    
    if (!tutorId) {
      return res.status(400).json({ message: 'Tutor ID is required' });
    }
    
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    
    // Update tutor information
    tutor.name = `${firstName} ${lastName}`;
    tutor.email = email;
    tutor.city = city;
    tutor.state = state;
    tutor.aadhar = aadhar;
    
    // Additional fields not in the original schema but useful to store
    tutor.phone = phone;
    tutor.gender = gender;
    tutor.dob = dob;
    tutor.bio = bio;
    tutor.country = country;
    tutor.address = address;
    
    await tutor.save();
    
    res.status(200).json({
      message: 'Personal details updated successfully',
      tutor: {
        id: tutor._id,
        name: tutor.name,
        email: tutor.email
      }
    });
  } catch (error) {
    console.error('Error updating personal details:', error);
    res.status(500).json({ message: 'Failed to update personal details', error: error.message });
  }
});

// Get all tutors data with class statistics
router.get('/class-statistics', async (req, res) => {
  try {
    const tutors = await Tutor.find();
    
    // Process the data to include class statistics
    const classStatistics = tutors.map(tutor => {
      // Get class status from virtual field
      const classStatus = tutor.classStudentStatus;
      const totalStudents = classStatus.totalStudents;
      
      // Calculate percentage of trial vs paid students
      const trialPercentage = (classStatus.totalTrialStudents / totalStudents * 100 || 0).toFixed(1);
      const paidPercentage = (classStatus.totalPaidStudents / totalStudents * 100 || 0).toFixed(1);
      
      // Calculate average students per subject
      const avgStudentsPerSubject = (totalStudents / (tutor.subjects.length || 1)).toFixed(1);
      
      return {
        tutorName: tutor.name,
        tutorId: tutor._id,
        role: tutor.role,
        totalSubjects: tutor.subjects.length,
        technologies: tutor.techUsed,
        languages: tutor.subjects.map(s => s.language).flat(),
        classStatus: classStatus,
        statistics: {
          totalStudents,
          trialPercentage: `${trialPercentage}%`,
          paidPercentage: `${paidPercentage}%`,
          avgStudentsPerSubject,
          conversionRate: classStatus.conversionRate
        }
      };
    });
    
    res.json(classStatistics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handle languages for tutor registration flow
router.put('/languages', async (req, res) => {
  try {
    const { tutorId, nativeLanguage, teachingLanguages } = req.body;
    
    if (!tutorId) {
      return res.status(400).json({ message: 'Tutor ID is required' });
    }
    
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    
    // Store languages information
    tutor.nativeLanguage = nativeLanguage;
    
    // Update subjects with language information
    if (teachingLanguages && teachingLanguages.length > 0) {
      teachingLanguages.forEach(lang => {
        // Find or create a subject for this language
        let subjectExists = false;
        
        for (let i = 0; i < tutor.subjects.length; i++) {
          if (tutor.subjects[i].subject === lang.language) {
            // Update existing subject
            subjectExists = true;
            if (!tutor.subjects[i].language.includes(lang.language)) {
              tutor.subjects[i].language.push(lang.language);
            }
            break;
          }
        }
        
        if (!subjectExists) {
          // Add new subject
          tutor.subjects.push({
            subject: lang.language,
            language: [lang.language],
            views: 0
          });
        }
      });
    }
    
    await tutor.save();
    
    res.status(200).json({
      message: 'Languages updated successfully'
    });
  } catch (error) {
    console.error('Error updating languages:', error);
    res.status(500).json({ message: 'Failed to update languages' });
  }
});

// Get views statistics for all tutors
router.get('/views-statistics', async (req, res) => {
  try {
    const tutors = await Tutor.find();
    
    // Process the data to include views statistics
    const viewsStatistics = tutors.map(tutor => {
      // Calculate total views
      const totalViews = tutor.Totalviews || 0;
      
      // Calculate percentage of views by subject
      const subjectViewsBreakdown = tutor.subjects.map(subject => ({
        subject: subject.subject,
        views: subject.views || 0,
        percentage: ((subject.views || 0) / (totalViews || 1) * 100).toFixed(1) + '%'
      }));
      
      return {
        tutorName: tutor.name,
        tutorId: tutor._id,
        role: tutor.role,
        viewsData: {
          totalViews,
          subjectBreakdown: subjectViewsBreakdown
        }
      };
    });
    
    res.json(viewsStatistics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
