const axios = require('axios');

exports.verifyCaptcha = async (captchaResponse) => {
  // Vérification si le CAPTCHA est vide
  if (!captchaResponse) {
    throw new Error('Please complete the CAPTCHA.');
  }

  try {
    // Appel à l'API Google pour vérifier le reCAPTCHA
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: captchaResponse,
      },
    });

    const { success } = response.data;

    if (!success) {
      throw new Error('CAPTCHA verification failed.');
    }
  } catch (error) {
    throw new Error('An error occurred during CAPTCHA verification.');
  }
};
