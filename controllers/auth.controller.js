const { findUserPerEmail } = require('../queries/user.queries');
const passport = require('passport');
const { createJwtToken } = require('../config/jwt.config');

exports.signinForm = (req, res, next) => {
  res.render('signin', { error: null });
}

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserPerEmail(email);
    if (user) {
      const match = await user.comparePassword(password);
      if (match) {
        req.login(user);
        res.redirect('/protected');
      } else {
        res.render('signin', { error: 'Wrong password' });
      }
    } else {
      res.render('signin', { error: 'User not found' });
    }
  } catch(e) {
    next(e);
  }

}

exports.googleAuth = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] }, {
    scope:
      'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  })(req, res, next);
};

exports.googleAuthCb = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    if (err || !user) {
      console.error('Error during Google authentication:', err);
      return res.redirect('/'); // Redirection en cas d'erreur
    }

    try {
      // Génération du token JWT après succès de Google Auth
      const token = createJwtToken({ user });
      // Stocke le token JWT dans un cookie
      res.cookie('jwt', token, { httpOnly: true });
      console.log('JWT token generated for Google user:', token);
      res.redirect('/protected'); // Redirection vers la page protégée
    } catch (error) {
      console.error('Error while creating JWT token:', error);
      res.redirect('/'); // Redirection en cas d'erreur lors de la création du token
    }
  })(req, res, next);
};







exports.signout = (req, res, next) => {
  req.logout();
  res.redirect('/');
}