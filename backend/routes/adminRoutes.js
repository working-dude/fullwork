const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');

// Create admin accounts (this endpoint will be for setting up initial admin users)
router.post('/setup', async (req, res) => {
  try {
    // Create admin student
    const studentExists = await Student.findOne({ username: 'admin' });
    
    if (!studentExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);
      
      const adminStudent = new Student({
        username: 'admin',
        password: hashedPassword,
        name: 'Admin Student',
        email: 'admin_student@example.com',
        role: 'student',
        grade: '12th',
        state: 'Delhi',
        city: 'New Delhi',
        phoneNumber: '9876543210'
      });
      
      await adminStudent.save();
      console.log('Admin student account created');
    }
    
    // Create admin tutor
    const tutorExists = await Tutor.findOne({ username: 'admin' });
    
    if (!tutorExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);
      
      const adminTutor = new Tutor({
        username: 'admin',
        password: hashedPassword,
        name: 'Admin Tutor',
        email: 'admin_tutor@example.com',
        city: 'Mumbai',
        state: 'Maharashtra',
        aadhar: '123456789012',
        role: 'teacher',
        subjects: [
          {
            subject: 'Mathematics',
            language: ['English', 'Hindi'],
            views: 100
          },
          {
            subject: 'Physics',
            language: ['English'],
            views: 50
          }
        ],
        techUsed: ['Whiteboard', 'Video', 'Interactive']
      });
      
      await adminTutor.save();
      console.log('Admin tutor account created');
    }
    
    res.status(200).json({ 
      message: 'Admin accounts created successfully',
      credentials: {
        username: 'admin',
        password: 'admin'
      }
    });
  } catch (error) {
    console.error('Error setting up admin accounts:', error);
    res.status(500).json({ message: 'Failed to set up admin accounts' });
  }
});

module.exports = router;