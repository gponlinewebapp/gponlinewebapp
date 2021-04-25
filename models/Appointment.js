const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const appointmentSchema = new mongoose.Schema({

  symptoms: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  video: {
    type: String,
    required: true
  },

  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
