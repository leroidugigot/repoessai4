const { createUser } = require('../queries/user.queries');
const axios = require('axios');

exports.userNew = (req, res, next) => {
  const siteKey = process.env.RECAPTCHA_SITE_KEY; // Assurez-vous d'avoir cette variable dans votre fichier .env
  res.render('signup', { error: null, siteKey });
};

exports.userCreate = async (req, res, next) => {
  const captcha = req.body['g-recaptcha-response'];

  // Vérifiez si le captcha est présent
  if (!captcha) {
      return res.status(400).json({ message: 'Please complete the CAPTCHA' });
  }

  try {
    console.log('Secret Key:', process.env.RECAPTCHA_SECRET_KEY); // À supprimer en production
    // Vérification avec l'API de Google reCAPTCHA
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
        params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: captcha,
        },
    });

    const { success } = response.data;

    if (success) {
      // Si le captcha est validé, redirigez vers protected.ejs
      res.redirect('/protected'); // ou utilisez res.render('protected') si vous voulez juste rendre la vue
    } else {
      // Si la validation du captcha échoue
      res.status(400).send('Captcha verification failed. Please try again.');
    }

  } catch (error) {
    console.error('Error verifying CAPTCHA:', error);
    res.status(500).send('An error occurred during CAPTCHA verification.');
  }
};


