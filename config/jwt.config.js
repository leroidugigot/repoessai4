const secret = 'a2463421-b798-470a-b4ee-fd23783ec69d';
const jwt = require('jsonwebtoken');
const { findUserPerId } = require('../queries/user.queries');
const { app } = require('../app');

const createJwtToken = ({ user = null, id = null }) => {
  const jwtToken = jwt.sign({
    sub: id || user._id.toString(),
    exp: Math.floor(Date.now() / 1000) + 5 // Expiration après 5 secondes pour les tests
  }, secret);
  
  console.log('JWT token created:', jwtToken);
  return jwtToken;
}

exports.createJwtToken = createJwtToken;

const checkExpirationToken = (token, res) => {
  const tokenExp = token.exp;
  const nowInSec = Math.floor(Date.now() / 1000);
  console.log('Checking token expiration:', { tokenExp, nowInSec });

  if (nowInSec <= tokenExp) {
    console.log('Token is valid:', token);
    return token;
  } else if (nowInSec > tokenExp && ((nowInSec - tokenExp) < 60 * 60 * 24)) {
    console.log('Token expired, refreshing token...');
    const refreshedToken = createJwtToken({ id: token.sub });
    res.cookie('jwt', refreshedToken);
    console.log('Refreshed token created and stored in cookie:', refreshedToken);
    return jwt.verify(refreshedToken, secret);
  } else {
    console.error('Token expired and cannot be refreshed:', token);
    throw new Error('token expired');
  }
}

const extractUserFromToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log('Extracting user from token, cookie value:', token);

  if (token) {
    try {
      console.log('Verifying token...');
      let decodedToken = jwt.verify(token, secret, { ignoreExpiration: true });
      console.log('Decoded token:', decodedToken);

      decodedToken = checkExpirationToken(decodedToken, res);
      const user = await findUserPerId(decodedToken.sub);
      console.log('User fetched from database:', user);

      if (user) {
        req.user = user;
        console.log('User authenticated successfully:', user);
        next();
      } else {
        console.warn('User not found for ID:', decodedToken.sub);
        res.clearCookie('jwt');
        res.redirect('/');
      }
    } catch (e) {
      console.error('Error during token verification:', e);
      res.clearCookie('jwt');
      res.redirect('/');
    }
  } else {
    console.log('No token found, proceeding without user authentication.');
    next();
  }
}

const addJwtFeatures = (req, res, next) => {
  console.log('Adding JWT features to request...');
  
  req.isAuthenticated = () => {
    const isAuth = !!req.user;
    console.log('Is user authenticated?', isAuth);
    return isAuth;
  };

  req.logout = () => {
    console.log('Logging out user, clearing JWT cookie...');
    res.clearCookie('jwt');
  };

  req.login = (user) => {
    console.log('Logging in user:', user);
    const token = createJwtToken({ user });
    res.cookie('jwt', token);
    console.log('User logged in, JWT stored in cookie:', token);
  };

  next();
}

// Middleware application
app.use(extractUserFromToken);
app.use(addJwtFeatures);
