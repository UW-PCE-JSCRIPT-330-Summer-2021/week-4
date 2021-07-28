const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    token: { type: String, required: true, index: true }
});

module.exports = mongoose.model("token", tokenSchema);