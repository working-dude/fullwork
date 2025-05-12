const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const Tutor = require('../models/Tutor');
const path = require('path');
const fs = require('fs');

// Multer storage setup for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir;
    if (file.fieldname === 'videos') {
      uploadDir = path.join(__dirname, '..', 'uploads', 'videos');
    } else {
      uploadDir = path.join(__dirname, '..', 'uploads');
    }
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// In-memory object to store registration data per user (not production safe)
let user = {};

// Step 1: Account creation
router.post('/register/step1', async (req, res) => {
  user = {}; // clear previous memory
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.username = username;
    user.password = hashedPassword;
    res.status(200).json({ message: 'Step 1 completed' });
  } catch (error) {
    res.status(500).json({ error: 'Error during registration step 1' });
  }
});

// Step 2: Personal information
router.post('/register/step2', (req, res) => {
  const { name, city, district, state, country } = req.body;
  try {
    user.name = name;
    user.city = city;
    user.district = district;
    user.state = state;
    user.country = country;
    res.status(200).json({ message: 'Step 2 completed' });
  } catch (error) {
    res.status(500).json({ error: 'Error during registration step 2' });
  }
});

// Step 3: Video upload (multiple videos for different languages)
router.post('/register/step3', upload.array('videos'), (req, res) => {
  try {
    const files = req.files;
    const languages = req.body.languages;
    
    // Handle multiple languages for multiple videos
    const languageArray = Array.isArray(languages) ? languages : [languages];

    user.videos = files.map((file, i) => ({
      language: languageArray[i],
      path: file.path,
    }));

    user.languages = languageArray; // persist language data for final step

    res.status(200).json({ message: 'Step 3 completed' });
  } catch (error) {
    res.status(500).json({ error: 'Error during registration step 3' });
  }
});

// Final Step: Save user to database
router.post('/register/complete', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected');
      return res.status(500).json({ error: 'Database not connected' });
    }

    const formData = req.body;

    const completeUser = {
      username: user.username,
      password: user.password,
      name: user.name || formData.name,
      email: formData.email,
      location: `${user.city || formData.city}, ${user.district || formData.district}, ${user.state || formData.state}, ${user.country || formData.country}`,
      videos: user.videos,
      city: user.city || formData.city,
      district: user.district || formData.district,
      state: user.state || formData.state,
      country: user.country || formData.country,
      languages: user.languages,
      experience: formData.experience,
      courses: formData.courses,
    };

    const newUser = new Tutor(completeUser);
    await newUser.save();

    user = {}; // clear memory

    res.status(201).json({ message: 'Registration completed successfully', user: newUser });
  } catch (error) {
    console.error('❌ Save error:', error.message);
    res.status(500).json({ error: 'Error saving user to database', detail: error.message });
  }
});

// Tutor Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await Tutor.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '2h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
