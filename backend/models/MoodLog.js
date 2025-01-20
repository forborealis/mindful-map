const mongoose = require('mongoose');

const MoodLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  mood: {
    type: String,
    // enum: ['Relaxed', 'Happy', 'Fine', 'Angry', 'Sad', 'Anxious'],
    required: true,
  },
  activities: {
    type: [String],
    // enum: ['Studying', 'Exam', 'Work', 'Reading', 'Gaming', 'Music', 'Movie', 'Drinking', 'Relax'],
    required: true,
  },
  social: {
    type: [String],
    // enum: ['Family', 'Friends', 'Relationship', 'Colleagues', 'Pets'],
    required: true,
  },
  health: {
    type: [String],
    // enum: ['Exercise', 'Walk', 'Run', 'Eat healthy'],
    required: true,
  },
  sleepQuality: {
    type: String,
    // enum: [1, 2, 3, 4],
    required: true,
  },
});

module.exports = mongoose.model('MoodLog', MoodLogSchema);