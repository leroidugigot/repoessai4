const secret = 'a2463421-b798-470a-b4ee-fd23783ec69d';
const jwt = require('jsonwebtoken');
const { findUserPerId } = require('../queries/user.queries');
const { app } = require('../app');

const createJwtToken = ({ user = null, id = null }) => {
  if (!user && !id) {
    throw new Error('User or ID must be provided to create a JWT token');
  }
  const jwtToken = jwt.sign({ 
    sub: id || user._id.toString(),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // expiration de 1 heure
  }, secret);
  console.log('jwt token crée');
  return jwtToken;
  
  
}


exports.createJwtToken = createJwtToken;

const checkExpirationToken = (token, res) => {
  const tokenExp = token.exp;
  const nowInSec = Math.floor(Date.now() / 1000);
  if (nowInSec <= tokenExp) {
    return token;
  } else if (nowInSec > tokenExp && ((nowInSec - tokenExp) < 60 * 60 * 24)) {
    const refreshedToken = createJwtToken({ id: token.sub });
    res.cookie('jwt', refreshedToken);
    return jwt.verify(refreshedToken, secret);
  } else {
    throw new Error('token expired');
  }
}


const extractUserFromToken = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    console.log('JWT token trouvé:', token); // Log pour indiquer que le JWT token a été trouvé
    try {
      let decodedToken = jwt.verify(token, secret, { ignoreExpiration: true });
      decodedToken = checkExpirationToken(decodedToken, res);
      const user = await findUserPerId(decodedToken.sub);
      if (user) {
        console.log('User found:', user); // Log pour vérifier si l'utilisateur est trouvé
        req.user = user;
        next();
      } else {
        console.log('No user found, clearing JWT cookie');
        res.clearCookie('jwt');
        res.redirect('/');
      }
    } catch (e) {
      console.error('Error during token verification:', e);
      res.clearCookie('jwt');
      res.redirect('/');
    }
  } else {
    console.log('No JWT token found');
    next();
  }
};


const addJwtFeatures = (req, res, next) => {
  req.isAuthenticated = () => !!req.user;
  req.logout = () => res.clearCookie('jwt')
req.login = (user) => {
  const token = createJwtToken({ user });
  res.cookie('jwt', token, {

  });
  console.log('JWT token set in cookie:', token);
};

  next();
}

if (app) {
  app.use(extractUserFromToken);
  app.use(addJwtFeatures);
} else {
  console.error('Express app instance is undefined');
}
