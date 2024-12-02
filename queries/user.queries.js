const User = require('../database/models/user.model');

exports.createUser = async (body) => {
  try {
    const hashedPassword = body.password ? await User.hashPassword(body.password) : null;
    const user = new User({ 
      username: body.username,
      local: {
        email: body.local?.email || body.email,
        password: hashedPassword,
        googleId: body.local?.googleId || body.googleId
      },
      avatar: body.avatar
    });
    const savedUser = await user.save();
    return savedUser;
  } catch(e) {
    console.error('Error creating user:', e);
    throw e;
  }
}


exports.findUserPerEmail = (email) => {
  return User.findOne({ 'local.email': email }).exec();
};

exports.findUserPerId = (id) => {
  return User.findOne({ _id: id }).exec();
}
