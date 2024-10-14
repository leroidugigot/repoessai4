const passport = require("passport");
const { findUserPerEmail } = require("../queries/user.queries");

exports.signinForm = (req, res, next) => {
  res.render("signin", { error: null });
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserPerEmail(email);
   
    
    if (user) {
      console.log('user recu dans signin auth.contollers');
      

      
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

exports.sessionCreate = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      next(e);
    } else if (!user) {
      res.render('signin', { error: info.message });
    } else {
      req.login(user, (err) => {
        if (err) {
          next(e);
        } else {
          res.redirect('/');
        }
      });
    }
  })(req, res, next);
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



exports.signout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.status(200).send("Logged out successfully");
  });
};
