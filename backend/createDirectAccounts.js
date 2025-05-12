const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Hard-code the MongoDB URI from the .env file
const MONGO_URI = 'mongodb+srv://manasakv:rHrCuiNe2QEsnPNb@teachers-student.ljeleal.mongodb.net/?retryWrites=true&w=majority&appName=Teachers-student';

async function createDirectAccounts() {
  try {
    // Connect to MongoDB and wait for connection
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;

    // First delete existing accounts if they exist
    console.log('Removing any existing demo accounts...');
    await db.collection('students').deleteMany({ username: 'demo_student' });
    await db.collection('tutors').deleteMany({ username: 'demo_tutor' });

    // Create password hash
    console.log('Creating password hash...');
    const plainPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Create student document directly in MongoDB (bypassing Mongoose)
    console.log('Creating demo student...');
    const studentResult = await db.collection('students').insertOne({
      username: 'demo_student',
      password: hashedPassword,
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
      sameAsPresent: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create tutor document directly in MongoDB (bypassing Mongoose)
    console.log('Creating demo tutor...');
    const tutorResult = await db.collection('tutors').insertOne({
      username: 'demo_tutor',
      password: hashedPassword,
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
      techUsed: ['Video Lectures', 'Interactive Assignments'],
      role: 'teacher',
      createdAt: new Date()
    });

    console.log('✅ Demo accounts created successfully!');
    console.log(`Student ID: ${studentResult.insertedId}`);
    console.log(`Tutor ID: ${tutorResult.insertedId}`);

    // Test the login by checking password match directly
    console.log('\nVerifying password storage...');
    const studentFromDB = await db.collection('students').findOne({ username: 'demo_student' });
    const studentPasswordMatch = await bcrypt.compare(plainPassword, studentFromDB.password);
    console.log(`Student password match: ${studentPasswordMatch ? 'SUCCESS' : 'FAILED'}`);

    const tutorFromDB = await db.collection('tutors').findOne({ username: 'demo_tutor' });
    const tutorPasswordMatch = await bcrypt.compare(plainPassword, tutorFromDB.password);
    console.log(`Tutor password match: ${tutorPasswordMatch ? 'SUCCESS' : 'FAILED'}`);

  } catch (error) {
    console.error('❌ Error creating direct accounts:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
createDirectAccounts();
