const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    
    email: { type: String, 
        unique: true,
        lowercase: true,
        trim: true,
        required: [true, 'User email required']
    },
    password: { type: String, required: [true, 'Password is required'], index: true }
});

userSchema.index({ email: 1}, { unique: true});


userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

module.exports = mongoose.model("users", userSchema);