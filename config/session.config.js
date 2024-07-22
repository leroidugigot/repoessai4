const app = require('../app');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { clientPromise } = require('../database');
const { default: mongoose } = require('mongoose');

app.use(
  session({
    secret: 'je suis un secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 14,
    },
    store: MongoStore.create({
      clientPromise: clientPromise.then((m) => mongoose.connection.getClient()),
      ttl: 60 * 60 * 24 * 14,
    }),
  })
);