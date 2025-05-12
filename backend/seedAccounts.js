const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const Student = require('./models/Student');
const Tutor = require('./models/Tutor');

// Connect to MongoDB
console.log('Trying to connect with:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB for seeding'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Demo accounts data
const demoAccounts = {
  student: {
    username: 'demo_student',
    password: 'password123',
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
  },
  tutor: {
    username: 'demo_tutor',
    password: 'password123',
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
  }
};

// Function to seed student account
const seedStudentAccount = async () => {
  try {
    // Check if the account already exists
    const existingStudent = await Student.findOne({ username: demoAccounts.student.username });
    
    if (existingStudent) {
      console.log('❗ Demo student account already exists');
      return;
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(demoAccounts.student.password, salt);
    
    // Create new student with hashed password
    const newStudent = new Student({
      ...demoAccounts.student,
      password: hashedPassword
    });
    
    await newStudent.save();
    console.log('✅ Demo student account created successfully');
  } catch (error) {
    console.error('❌ Error creating demo student account:', error);
  }
};

// Function to seed tutor account
const seedTutorAccount = async () => {
  try {
    // Check if the account already exists
    const existingTutor = await Tutor.findOne({ username: demoAccounts.tutor.username });
    
    if (existingTutor) {
      console.log('❗ Demo tutor account already exists');
      return;
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(demoAccounts.tutor.password, salt);
    
    // Create new tutor with hashed password
    const newTutor = new Tutor({
      ...demoAccounts.tutor,
      password: hashedPassword
    });
    
    await newTutor.save();
    console.log('✅ Demo tutor account created successfully');
  } catch (error) {
    console.error('❌ Error creating demo tutor account:', error);
  }
};

// Seed both accounts and close connection
const seedAccounts = async () => {
  try {
    console.log('Starting to seed accounts...');
    await seedStudentAccount();
    await seedTutorAccount();
    console.log('✅ Account seeding completed');
    
    // Verify accounts were created
    const studentCount = await Student.countDocuments({ username: demoAccounts.student.username });
    const tutorCount = await Tutor.countDocuments({ username: demoAccounts.tutor.username });
    
    console.log(`Student account exists: ${studentCount > 0 ? 'YES' : 'NO'}`);
    console.log(`Tutor account exists: ${tutorCount > 0 ? 'YES' : 'NO'}`);
  } catch (error) {
    console.error('❌ Error seeding accounts:', error);
  } finally {
    console.log('Closing MongoDB connection...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

// Run the seeding
seedAccounts();
