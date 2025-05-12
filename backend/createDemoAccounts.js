const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const Student = require('./models/Student');
const Tutor = require('./models/Tutor');

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Create direct accounts bypassing middleware by using direct MongoDB operations
async function createDemoAccounts() {
  try {
    // First delete any existing accounts with these usernames
    console.log('Removing any existing demo accounts...');
    await Student.deleteOne({ username: 'demo_student' });
    await Tutor.deleteOne({ username: 'demo_tutor' });
    
    // Hash passwords directly
    console.log('Hashing passwords...');
    const password = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
      console.log('Creating demo student...');
    // Use insertOne to bypass Mongoose middleware (especially the password hashing pre-save hook)
    const studentDoc = {
      username: 'demo_student',
      password: hashedPassword, // Already hashed
      name: 'Demo Student',
      dob: new Date('2000-01-01'),
      birthPlace: 'New Delhi',
      currentLocation: 'Mumbai',
      motherLanguage: 'Hindi',
      localLanguage: 'English',
      presentAddress: {
        address: '123 Present St',
        city: 'Mumbai',
        pincode: '400001'
      },
      permanentAddress: {
        address: '456 Permanent St',
        city: 'New Delhi',
        pincode: '110001'
      },
      sameAsPresent: false
    };
    
    console.log('Creating demo tutor...');
    // Create demo tutor directly in the database
    const tutor = await Tutor.create({
      username: 'demo_tutor',
      password: hashedPassword, // Pre-hashed password to avoid double hashing
      name: 'Demo Tutor',
      email: 'demo_tutor@example.com',
      city: 'Bangalore',
      state: 'Karnataka',
      aadhar: '123456789012',
      phone: '9876543210',
      gender: 'Male',
      dob: new Date('1990-01-01'),
      bio: 'Experienced tutor with 5+ years of teaching experience',
      country: 'India',
      address: '789 Tutor St, Bangalore',
      subjects: [
        {
          subject: 'Mathematics',
          language: ['English', 'Hindi']
        },
        {
          subject: 'Physics',
          language: ['English']
        }
      ],
      techUsed: ['Video Lectures', 'Interactive Assignments']
    });
    
    console.log('✅ Demo accounts created successfully!');
    console.log(`Student ID: ${student._id}`);
    console.log(`Tutor ID: ${tutor._id}`);
    
    // Test login directly from here
    console.log('\nTesting student login...');
    const studentFromDB = await Student.findOne({ username: 'demo_student' });
    const studentPasswordMatch = await bcrypt.compare('password123', studentFromDB.password);
    console.log(`Student password match: ${studentPasswordMatch ? 'SUCCESS' : 'FAILED'}`);
    
    console.log('\nTesting tutor login...');
    const tutorFromDB = await Tutor.findOne({ username: 'demo_tutor' });
    const tutorPasswordMatch = await bcrypt.compare('password123', tutorFromDB.password);
    console.log(`Tutor password match: ${tutorPasswordMatch ? 'SUCCESS' : 'FAILED'}`);
    
  } catch (error) {
    console.error('❌ Error creating demo accounts:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

createDemoAccounts();
