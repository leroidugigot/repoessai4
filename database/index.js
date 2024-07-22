const mongoose = require('mongoose');
const env = require(`../environment/${ process.env.NODE_ENV }`);

exports.clientPromise = mongoose.connect(env.dbUrl).then( () => console.log('connexion db ok !')).catch( err => console.log(err));