const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Schéma de l'utilisateur
const userSchema = schema({
  username: { type: String, required: true, unique: true },
  local: {
    formations: [{
      formation: { type: mongoose.Schema.Types.ObjectId, ref: 'Formation' },
      progression: [{
        module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
        videoWatched: { type: Boolean, default: false }, // Ajout
        timeSpentReading: { type: Boolean, default: false }, // Ajout
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

// Méthode pour hacher un mot de passe
userSchema.statics.hashPassword = async (password) => {
  if (!password) return null;  // Ne hache pas si le mot de passe est vide
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Méthode pour comparer un mot de passe
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.local.password);
};

// Modèle de l'utilisateur
const User = mongoose.model('User', userSchema);

module.exports = User;
