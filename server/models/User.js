// Referencing code from Module 21
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// import schema from Brewery.js
const brewerySchema = require('./Brewery');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // set savedBreweries to be an array of data that adheres to the brewerySchema
    savedBreweries: [brewerySchema],
  },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// set up pre-save middleware to create password and hash user password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// compare the incoming password with the hashed password when we query a user, we'll also get another field called `breweryCount` with the number of saved brewerys we have
userSchema.virtual('breweryCount').get(function () {
  return this.savedBreweries.length;
});

const User = model('User', userSchema);

module.exports = User;
