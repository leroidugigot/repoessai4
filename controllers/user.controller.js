const { createUser } = require('../queries/user.queries');
const { verifyCaptcha } = require('../config/recaptcha.config'); // Import du fichier reCAPTCHA

exports.userNew = (req, res, next) => {
  const siteKey = process.env.RECAPTCHA_SITE_KEY; // Assurez-vous d'avoir cette variable dans votre fichier .env
  res.render('signup', { error: null, siteKey });
};

exports.userCreate = async (req, res, next) => {
  try {
    const body = req.body;

    // Vérification du CAPTCHA via recaptcha.config.js
    await verifyCaptcha(req.body['g-recaptcha-response']);

    // Création de l'utilisateur via user.query.js
    const user = await createUser(body);

    // Connexion de l'utilisateur avec JWT
    req.login(user);

    // Redirection vers la page protégée après création
    res.redirect('/formations/protected');
  } catch (e) {
    console.error('Error during user creation:', e.message);
    res.render('signup', { error: e.message });
  }
};
