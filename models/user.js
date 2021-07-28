const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{
      type: String,
      required: true,
      maxLength: 32,
      trim: true
  },
  lastname:{
      type: String,
      Maxlengh: 32,
      trim:true
  },
  email:{
      type:String,
      trim: true,
      required: true,
      unique: true
  },
  password:{
    type:String,
    trim: true,
    required: true,
    unique: true
  }
});


module.exports = mongoose.model("users", userSchema);