const { Schema, model } = require("mongoose");
const userSchema = Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema)
module.exports = User