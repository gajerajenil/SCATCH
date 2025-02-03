const mongoose = require('mongoose');
const config = require('config');
const dbgr = require('debug')("development:mongoose");

//Use template literals properly
mongoose
  .connect(`${config.get("MONGODB_URI")}/scatch`)
  .then(() => dbgr('connected'))
  .catch((err) => dbgr('Connection error:', err.message));

module.exports = mongoose.connection;
