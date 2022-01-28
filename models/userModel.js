const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "A user must have an email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: [8, "Password should be atleast 8 characters long"],
    select: false,
  },
  passCreatedAt: {
    type: Date,
    required: true,
    select:false,
  }
});

userSchema.methods.correctPassword = async function(password, checkPass){
  return await bcrypt.compare(password, checkPass)
}

// userSchema.methods.passCreatedAfter = async function (setTime) {
//   return setTime > this.passCreatedAt 
// }

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
})

const User = mongoose.model("User", userSchema);



module.exports = User;
