const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tutorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tutor', 
    required: true 
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  classTime: { 
    type: Date, 
    required: true 
  },
  trialClass: { 
    type: Boolean, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['tentative', 'present', 'absent'], 
    default: 'tentative' 
  },
  classLink: { 
    type: String, 
    default: 'https://meet.google.com/xyz-abc' 
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
