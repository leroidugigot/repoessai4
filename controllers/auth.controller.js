const passport = require("passport");
const { findUserPerEmail } = require("../queries/user.queries"); 


//verife
exports.signinForm = (req, res, next) => {
  res.render("signin", { error: null });
};


//verifié
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
   //authetification avec google passport.authtificate mais pas de bdd
exports.sessionCreate = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    } else if (!user) {
      res.render("signin", { error: info.message });
    } else {
      req.login(user, (err) => {
        if (err) {
          return next(err);
        } else {
          res.redirect("/protected");
        }
      });
    }
  })(req, res, next);
};



exports.sessionNew = (req, res, next) => {
  res.render('signin', { error: null });
};



exports.googleAuth = (req, res, next) => {
  passport.authenticate('google', {
    scope:
      'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  })(req, res, next);
};

exports.googleAuthCb = (req, res, next) => {
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: '/auth/signin/form',
  })(req, res, next);
};


//verifié
// auth.controller.js
exports.signout = (req, res) => {
  req.logout((err) => {
      if (err) {
          return res.status(500).json({ message: 'Logout failed', error: err });
      }
      // Redirection ou réponse après la déconnexion réussie
      res.status(200).json({ message: 'Logged out successfully' });
  });
};

