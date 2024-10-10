const { createUser } = require('../queries/user.queries');

exports.userNew = (req, res, next) => {
  res.render('signup', { error: null });
}

exports.userCreate = async (req, res, next) => {
  try {
    const body = req.body;
    const user = await createUser(body);
    req.login(user, (err) => {
      if (err) { next(err) }
      res.redirect('/protected');
    })
  } catch(e) {
    res.render('signup', { error: e.message });
  }
}

exports.getConnectedUsers = async (req, res) => {
  try {
      const users = await User.find(); // ou une méthode pour les utilisateurs connectés
      res.render('connectedList', { users });
  } catch (err) {
      console.error(err);
      res.status(500).send('Erreur serveur');
  }
};