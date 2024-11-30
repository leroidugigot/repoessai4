const User = require('../database/models/user.model');

exports.createUser = async (body) => {
  try {
    const hashedPassword = body.password ? await User.hashPassword(body.password) : null;
    const user = new User({ 
      username: body.username,
      local: {
        email: body.email,
        password: hashedPassword,  // Ce champ peut être null pour Google OAuth
        googleId: body.googleId    // Assurez-vous de stocker l'ID Google si l'utilisateur vient de Google
      },
      avatar: body.avatar  // Vous pouvez aussi stocker l'avatar de Google
    });
    const savedUser = await user.save();
    return savedUser;
  } catch(e) {
    console.error('Error creating user:', e);
    throw e;
  }
}


exports.findUserPerEmail = (email) => {
  return User.findOne({
    $or: [
      { 'local.email': email },
      { email: email }  // Pour les utilisateurs Google
    ]
  }).exec();
};

exports.findUserPerId = (id) => {
  return User.findOne({ _id: id }).exec();
}
