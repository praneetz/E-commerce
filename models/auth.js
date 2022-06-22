const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const authSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 10,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 10,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 20,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

authSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt);
  next()
});
module.exports = mongoose.model("auth", authSchema);
