const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  students: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'tentative'],
      default: 'tentative'
    },
    trialClass: {
      type: Boolean,
      default: false
    }
  }],
  classLink: {
    type: String,
    default: 'https://meet.google.com/xyz-abc'
  }
}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
