const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = schema({
  username: { type: String, required: true, unique: true },
  local: {
    email: { type: String, required: true, unique: true },
    password: { type: String },  // Rend le champ facultatif pour Google OAuth
    googleId: { type: String }
  },
  avatar: { type: String, default: '/images/default-profile.svg' },
});

userSchema.statics.hashPassword = async (password) => {
  if (!password) return null;  // Ne hache pas si le mot de passe est vide
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.local.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;
