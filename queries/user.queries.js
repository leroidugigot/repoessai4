const User = require('../database/models/user.model');

exports.createUser = async (body) => {
  try {
    const hashedPassword = await User.hashPassword(body.password);
    const user = new User({ 
      username: body.username,
      local: {
        email: body.email,
        password: hashedPassword
      }
    });
    return user.save();
  } catch(e) {
    throw e;
  }
}

exports.findUserPerEmail = (email) => {
  console.log(User); // Vérifie si tu obtiens des utilisateurs
  return User.findOne({ 'local.email': email }).exec();
}

exports.findUserPerId = (id) => {
  return User.findOne({ _id: id }).exec();
}

exports.findUserPerGoogleId = (googleId) => {
  return User.findOne({ 'local.googleId': googleId }).exec();
}

// Ajout de la fonction pour Yahoo
exports.findUserPerYahooId = (yahooId) => {
  return User.findOne({ 'local.yahooId': yahooId }).exec();
}

