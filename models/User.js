const mongoose = require('mongoose');
const { Schema } = require('mongoose');

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
  userAppointment: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }]
});

//---------------------------------------------------------------

// TESTING CODE
// UserSchema.virtual('userAppointment', {
//   ref: 'Appointment', //The Model to use
//   localField: '_id', //Find in Model, where localField
//   foreignField: 'user', // is equal to foreignField
// });

// // Set Object and Json property to true. Default is set to false
// UserSchema.set('toObject', { virtuals: true });
// UserSchema.set('toJSON', { virtuals: true });
//---------------------------------------------------------------
//user variable
const User = mongoose.model('User', UserSchema);

module.exports = User;