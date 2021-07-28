const mongoose = require('mongoose');

//email and password.
const userSchema = new mongoose.Schema({
	password: { type: String, required: true },
	email: { type: String, required: true },
});


module.exports = mongoose.model("users", userSchema);