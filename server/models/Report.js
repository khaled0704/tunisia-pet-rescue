const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    photos: [{ type: String }],
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    city: {
      type: String,
      required: true,
    },
    species: {
      type: String,
      enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved'],
      default: 'pending',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shelter',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);