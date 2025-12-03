const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    min: [5, 'The user name must not be less than 5 characters'],
    max: [20, 'The user name must not be more than 20 characters'],
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    tolowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

//Hash password before saving
userSchema.pre('save', async function() {
  if(!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

//Function to compare password during login
userSchema.methods.isCorrectPassword = async function(inputPassword, savedPassword) {
  return await bcrypt.compare(inputPassword, savedPassword);
}

module.exports = mongoose.model('users', userSchema);