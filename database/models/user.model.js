const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const userSchema = schema({
  username: { type: String, required: true, unique: true },
  local: {
    email: { type: String, required: true, unique: true },
    password: { type: String },


  },
  avatar: { type: String, default: '/images/default-profile.svg' },
});

userSchema.statics.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  } catch(e) {
    throw e
  }
}

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.local.password)
}

const User = mongoose.model('User', userSchema);
console.log(User);


module.exports = User;
