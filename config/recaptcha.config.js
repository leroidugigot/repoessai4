const axios = require('axios');

exports.verifyCaptcha = async (captchaResponse) => {
  // Log pour capturer le début de la vérification
  console.log('Starting CAPTCHA verification...');

  // Vérification si le CAPTCHA est vide
  if (!captchaResponse) {
    console.log('CAPTCHA not provided.');
    throw new Error('Please complete the CAPTCHA.');
  }

  // Log pour indiquer l'appel à l'API Google
  console.log('Sending CAPTCHA response to Google for verification...');

  try {
    // Appel à l'API Google pour vérifier le reCAPTCHA
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: captchaResponse,
      },
    });

    const { success } = response.data;

    // Log pour la réponse de Google
    console.log('CAPTCHA verification response from Google:', success);

    if (!success) {
      console.log('CAPTCHA verification failed.');
      throw new Error('CAPTCHA verification failed.');
    }

    // Log si la vérification est réussie
    console.log('CAPTCHA verification successful.');
  } catch (error) {
    // Log en cas d'erreur lors de l'appel à l'API Google
    console.error('Error during CAPTCHA verification:', error);
    throw new Error('An error occurred during CAPTCHA verification.');
  }
};
