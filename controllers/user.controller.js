const { createUser } = require('../queries/user.queries');
const axios = require('axios');

exports.userNew = (req, res, next) => {
  const siteKey = process.env.RECAPTCHA_SITE_KEY; // Assurez-vous d'avoir cette variable dans votre fichier .env
  res.render('signup', { error: null, siteKey });
};


              //authtification via formulaire
              exports.userCreate = async (req, res, next) => {
                const captcha = req.body['g-recaptcha-response'];
              
                // Vérifiez si le captcha est présent
                if (!captcha) {
                    return res.status(400).json({ message: 'Please complete the CAPTCHA' });
                }
              
                try {
                  // Vérification avec l'API de Google reCAPTCHA
                  const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
                      params: {
                          secret: process.env.RECAPTCHA_SECRET_KEY,
                          response: captcha,
                      },
                  });
              
                  const { success } = response.data;
              
                  if (success) {
                    // Si le captcha est validé, on crée l'utilisateur
                    const body = req.body;
                    const user = await createUser(body);
                    
                    // Passer une fonction de rappel à req.login
                    req.login(user, (err) => {
                      if (err) {
                        return next(err); // Gérer l'erreur de connexion
                      }
                      res.redirect('/protected'); // Rediriger après connexion réussie
                    });
                  } else {
                    // Si la validation du captcha échoue
                    res.status(400).send('Captcha verification failed. Please try again.');
                  }
              
                } catch (error) {
                  console.error('Error verifying CAPTCHA:', error);
                  res.status(500).send('An error occurred during CAPTCHA verification.');
                }
              };
              
