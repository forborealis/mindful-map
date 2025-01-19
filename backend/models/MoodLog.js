const mongoose = require('mongoose');

const MoodLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  mood: {
    type: String,
    enum: ['Relaxed', 'Happy', 'Fine', 'Angry', 'Sad', 'Anxious'],
    required: true,
  },
  activities: {
    type: [String],
    enum: ['Studying', 'Exam', 'Work', 'Reading', 'Gaming', 'Playing with pet'],
    required: true,
  },
  social: {
    type: [String],
    enum: ['Family', 'Friends', 'Significant other', 'Colleagues'],
    required: true,
  },
  health: {
    type: [String],
    enum: ['Exercise', 'Walk', 'Run', 'Drink water', 'Eat healthy'],
    required: true,
  },
  sleepQuality: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
  },
});

module.exports = mongoose.model('MoodLog', MoodLogSchema);