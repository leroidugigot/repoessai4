const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const schema = mongoose.Schema;


const userSchema = schema({
  local: {
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      maxlength: 254,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Email is not valid'
      }
    },
    password: { 
      type: String, 
      required: true,
      maxlength: 100
    },
  },
  username: { 
    type: String, 
    maxlength: 50 
  }
});

// Middleware pour hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function(next) {
  console.log('Middleware pré-enregistrement activé');
  if (this.isModified('local.password')) {
    console.log('Hachage du mot de passe...');
    this.local.password = await User.hashPassword(this.local.password); // Appel de la méthode statique
    console.log('Mot de passe haché avec succès');
  } else {
    console.log('Mot de passe non modifié, pas de hachage nécessaire');
  }
  next();
});

// Méthode statique pour hacher le mot de passe
userSchema.statics.hashPassword = async (password) => {
  console.log('Début du hachage du mot de passe');
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hachage du mot de passe réussi');
    return hashedPassword;
  } catch (e) {
    console.error('Erreur lors du hachage du mot de passe:', e);
    throw e;
  }
};

// Méthode d'instance pour comparer le mot de passe
userSchema.methods.comparePassword = async function(password) {
  console.log('Comparaison des mots de passe...');
  const isMatch = await bcrypt.compare(password, this.local.password);
  console.log('Résultat de la comparaison:', isMatch);
  return isMatch;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
