const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function testLogin() {
  try {
    console.log('Testing student login...');
    const studentResponse = await axios.post('http://localhost:5000/api/student/login', {
      username: 'demo_student',
      password: 'password123'
    });
    console.log('Student login successful!');
    console.log('Student data:', studentResponse.data);
  } catch (error) {
    console.error('❌ Student login error:', error.response?.data || error.message);
  }

  try {
    console.log('\nTesting tutor login...');
    const tutorResponse = await axios.post('http://localhost:5000/api/tutor/login', {
      username: 'demo_tutor',
      password: 'password123'
    });
    console.log('Tutor login successful!');
    console.log('Tutor data:', tutorResponse.data);
  } catch (error) {
    console.error('❌ Tutor login error:', error.response?.data || error.message);
  }
}

testLogin();
