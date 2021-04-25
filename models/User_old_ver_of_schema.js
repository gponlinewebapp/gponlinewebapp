const mongoose = require('mongoose');

//###################################################################
const appointmentSchema = new mongoose.Schema({
  // const appointmentSchema = new mongoose.Schema({

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
  }

});
//###################################################################

const UserSchema = new mongoose.Schema({


  fname: {
    type: String,
    require: true
  },
  lname: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  mobile: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  address: {
    type: String,
    require: true
  },
  // appointment: [appointmentSchema]
  appointment: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }]
});
//user variable
const User = mongoose.model('User', UserSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);
//const UserAppoint = mongoose.model('UserAppoint', appointmentSchema);

module.exports = User;
// module.exports = UserAppoint;
module.exports = Appointment;