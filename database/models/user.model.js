// user.model.js
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = schema({
  username: { type: String, required: true },
  local: {
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    formations: [{
      formation: { type: mongoose.Schema.Types.ObjectId, ref: 'Formation' },
      progression: [{
        module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
        videoWatched: { type: Boolean, default: false },
        timeSpentReading: { type: Boolean, default: false },
        quiz: {
          passed: { type: Boolean, default: false },
          score: { type: Number },
          attempts: { type: Number, default: 0 }
        }
      }]
    }]
  },
  avatar: { type: String, default: '/images/default-profile.svg' }
});

// Méthodes de hachage et comparaison de mot de passe
userSchema.statics.hashPassword = async (password) => {
  if (!password) return null;
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.local.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;