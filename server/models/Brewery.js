// Referencing code from Module 21
const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBreweries` array in User.js
const brewerySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  breweryType: {
    type: String
  },
  // saved breweryId id from https://www.openbrewerydb.org/
  breweryId: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
    required: true,
  },
});

module.exports = brewerySchema;
