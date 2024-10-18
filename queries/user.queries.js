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
    const savedUser = await user.save();
    console.log('User saved to database:', savedUser);
    return savedUser;
  } catch(e) {
    console.error('Error creating user:', e);
    throw e;
  }
}

exports.findUserPerEmail = (email) => {
  return User.findOne({ 'local.email': email }).exec();
}

exports.findUserPerId = (id) => {
  return User.findOne({ _id: id }).exec();
}
