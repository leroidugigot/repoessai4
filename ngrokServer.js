require('dotenv').config();

const ngrok = require('@ngrok/ngrok');
const app = require('./app'); // S'assurer que le chemin est correct
const port = process.env.PORT || 3000;

// Démarrer votre serveur Express
app.listen(port, () => {
    console.log(`Node.js web server at ${port} is running...`);
});

// Ouvrir le tunnel Ngrok avec l'authtoken depuis .env
ngrok.connect({ addr: port, authtoken: process.env.NGROK_AUTHTOKEN })
    .then(connection => {
        console.log(`Ingress established at: ${connection.url()}`); // Appel de la méthode url()
    })
    .catch(err => console.error('Ngrok error:', err));
