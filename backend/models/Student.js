const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the student schema
const studentSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Phone number as username
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  dob: { 
    type: Date, 
    required: true 
  },
  birthPlace: { 
    type: String, 
    required: true 
  },
  currentLocation: { 
    type: String, 
    required: true 
  },
  motherLanguage: { 
    type: String, 
    required: true 
  },
  localLanguage: { 
    type: String, 
    required: true 
  },
  presentAddress: { 
    address: { type: String, required: true },
    city: { type: String, required: true }, 
    pincode: { type: String, required: true }
  },
  permanentAddress: { 
    address: { type: String, required: true },
    city: { type: String, required: true }, 
    pincode: { type: String, required: true }
  },
  sameAsPresent: { 
    type: Boolean, 
    default: false 
  },
  classes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class'
  }],
  classStatus: [
    {
      classId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Class'
      },
      status: { 
        type: String, 
        enum: ['present', 'absent', 'tentative'], 
        default: 'tentative' 
      }
    }
  ],
  refreshToken: {
    type: String
  }
}, { timestamps: true });

// Hash password before saving
studentSchema.pre('save', async function(next) {
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

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
