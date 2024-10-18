const { createUser } = require('../queries/user.queries');
const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.userNew = (req, res, next) => {
  const siteKey = process.env.RECAPTCHA_SITE_KEY; // Assurez-vous d'avoir cette variable dans votre fichier .env
  res.render('signup', { error: null, siteKey });
};

// Authentification via formulaire avec JWT et vérification reCAPTCHA
exports.userCreate = async (req, res, next) => {
  const captcha = req.body['g-recaptcha-response'];

  // Vérifiez si le captcha est présent
  if (!captcha) {
      console.log('CAPTCHA not provided.');
      return res.status(400).json({ message: 'Please complete the CAPTCHA' });
  }

  try {
    // Vérification avec l'API de Google reCAPTCHA
    console.log('Verifying CAPTCHA...');
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
        params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: captcha,
        },
    });

    const { success } = response.data;
    console.log('CAPTCHA verification response:', success);

    if (success) {
      // Si le captcha est validé, on crée l'utilisateur
      const body = req.body;
      console.log('Creating user with data:', body);
      const user = await createUser(body);

      // Vérifiez que l'utilisateur a été créé
      console.log('User created:', user);

      // Génération du token JWT après création de l'utilisateur
      const token = jwt.sign(
        { id: user._id, email: user.local.email }, // Assurez-vous que c'est 'user.local.email'
        process.env.JWT_SECRET, // Utilisez une clé secrète définie dans votre fichier .env
        { expiresIn: '1h' }
      );
      console.log('Generated JWT token:', token);

      // Stockage du token dans un cookie sécurisé
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Utiliser true en production pour HTTPS
        maxAge: 3600000, // 1 heure
      });

      // Redirection vers la page protégée
      console.log('Redirecting to /protected...');
      res.redirect('/protected');
      
    } else {
      // Si la validation du captcha échoue
      console.log('CAPTCHA verification failed.');
      res.status(400).send('Captcha verification failed. Please try again.');
    }

  } catch (error) {
    console.error('Error verifying CAPTCHA:', error);
    res.status(500).send('An error occurred during CAPTCHA verification.');
  }
};
