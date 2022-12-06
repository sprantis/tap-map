// Referencing code from Module 21
const mongoose = require('mongoose');

// changes from localhost to 127.0.0.1 due to updated node version
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/openbrewerydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;
