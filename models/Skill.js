const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Testing', 'Other']
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 70
  },
  icon: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Skill', skillSchema);
