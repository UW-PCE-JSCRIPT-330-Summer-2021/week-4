//Similar syntax from /models/note

const mongoose = require('mongoose');

//Tokens are unique to one user at a time
//Tokens expire after a certain amount of time
//Make tokens required, as well as the userid
const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true},
  userId: { type: String, index: true, required: true }
});


//tokenSchema.index({ userId: 'text' });

module.exports = mongoose.model("tokens", tokenSchema);