const express = require('express');
const router = express.Router();
const { authenticateJWT, authenticateRole } = require('../middleware/auth');
const Course = require('../models/Course');
const Tutor = require('../models/Tutor');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('tutorId', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('tutorId', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new course (tutor only)
router.post('/', authenticateJWT, authenticateRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { title, description, price, language } = req.body;
    const tutorId = req.user.id;
    
    // Verify tutor exists
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });
    
    const course = new Course({
      title,
      description,
      price,
      language,
      tutorId
    });
    
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a course (tutor only)
router.put('/:id', authenticateJWT, authenticateRole(['teacher', 'admin']), async (req, res) => {
  try {
    const courseId = req.params.id;
    const tutorId = req.user.id;
    
    // Make sure the course exists and belongs to this tutor
    const course = await Course.findOne({ _id: courseId, tutorId });
    if (!course) return res.status(404).json({ message: 'Course not found or you do not have permission' });
    
    // Update the course with new data
    Object.keys(req.body).forEach(key => {
      course[key] = req.body[key];
    });
    
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a course (tutor only)
router.delete('/:id', authenticateJWT, authenticateRole(['teacher', 'admin']), async (req, res) => {
  try {
    const courseId = req.params.id;
    const tutorId = req.user.id;
    
    // Make sure the course exists and belongs to this tutor
    const course = await Course.findOne({ _id: courseId, tutorId });
    if (!course) return res.status(404).json({ message: 'Course not found or you do not have permission' });
    
    await course.remove();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get courses by tutor
router.get('/tutor/:tutorId', async (req, res) => {
  try {
    const tutorId = req.params.tutorId;
    const courses = await Course.find({ tutorId });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get courses by language
router.get('/language/:language', async (req, res) => {
  try {
    const language = req.params.language;
    const courses = await Course.find({ language }).populate('tutorId', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
