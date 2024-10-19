const { createUser } = require('../queries/user.queries');
const { verifyCaptcha } = require('../config/recaptcha.config'); // Import du fichier reCAPTCHA

exports.userNew = (req, res, next) => {
  const siteKey = process.env.RECAPTCHA_SITE_KEY; // Assurez-vous d'avoir cette variable dans votre fichier .env
  console.log('Rendering signup page with siteKey:', siteKey);
  res.render('signup', { error: null, siteKey });
};

exports.userCreate = async (req, res, next) => {
  try {
    const body = req.body;
    console.log('Received user creation request with body:', body);

    // Vérification du CAPTCHA via recaptcha.config.js
    await verifyCaptcha(req.body['g-recaptcha-response']);
    console.log('CAPTCHA verified successfully.');

    // Création de l'utilisateur via user.query.js
    const user = await createUser(body);
    console.log('User created successfully:', user);

    // Connexion de l'utilisateur avec JWT
    req.login(user);
    console.log('User logged in successfully, redirecting to /protected');

    // Redirection vers la page protégée après création
    res.redirect('/protected');
  } catch (e) {
    console.error('Error during user creation:', e.message);
    res.render('signup', { error: e.message });
  }
};
