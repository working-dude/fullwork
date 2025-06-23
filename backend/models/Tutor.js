const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const tutorSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },  aadhar: {
    type: String,
    required: true
  },
  profileImage: {
    type: String
  },
  phone: {
    type: String
  },
  gender: {
    type: String
  },
  dob: {
    type: Date
  },
  bio: {
    type: String
  },
  country: {
    type: String
  },
  address: {
    type: String
  },
  subjects: [{
    subject: String,
    views: {
      type: Number,
      default: 0
    },
    language: [String]
  }],
  techUsed: [String],
  videos: [{
    title: String,
    description: String,
    path: String,
    subject: String,
    language: String,
    views: {
      type: Number,
      default: 0
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  Totalviews: {
    type: Number,
    default: 0
  },
  teacherID: String,
  role: {
    type: String,
    default: 'teacher'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  refreshToken: {
    type: String
  }
});

// Hash password before saving
tutorSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Virtual for class status
tutorSchema.virtual('classStudentStatus').get(function() {
  // Calculation for class status would go here
  // This is a placeholder implementation
  const totalStudents = 0;
  const totalTrialStudents = 0;
  const totalPaidStudents = 0;
  return {
    totalStudents,
    totalTrialStudents,
    totalPaidStudents,
    conversionRate: totalStudents > 0 ? (totalPaidStudents / totalStudents * 100).toFixed(1) + '%' : '0%'
  };
});

const Tutor = mongoose.model('Tutor', tutorSchema);

module.exports = Tutor;
