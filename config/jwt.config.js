const jwt = require('jsonwebtoken');
const { findUserPerId } = require('../queries/user.queries');

const secret = process.env.JWT_SECRET; // Assurez-vous que ce secret est bien défini

const createJwtToken = ({ user = null, id = null }) => {
  const jwtToken = jwt.sign({ 
    sub: id || user._id.toString(),
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 heure
  }, secret);
  return jwtToken;
}

const checkExpirationToken = (token, res) => {
  const tokenExp = token.exp;
  const nowInSec = Math.floor(Date.now() / 1000);
  console.log('Checking token expiration:', { tokenExp, nowInSec });

  if (nowInSec <= tokenExp) {
    return token;
  } else if (nowInSec > tokenExp && ((nowInSec - tokenExp) < 60 * 60 * 24)) {
    const refreshedToken = createJwtToken({ id: token.sub });
    res.cookie('jwt', refreshedToken);
    console.log('Token refreshed:', refreshedToken);
    return jwt.verify(refreshedToken, secret);
  } else {
    throw new Error('token expired');
  }
}

const extractUserFromToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log('Extracting user from token, cookie value:', token);

  if (token) {
    try {
      // Vérifiez et décodez le token
      let decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Ne pas ignorer l'expiration
      console.log('Decoded token:', decodedToken);

      // Vérifiez si l'utilisateur existe
      const user = await findUserPerId(decodedToken.id); // Utilisez 'id' si vous avez mis le champ id dans le token
      console.log('User fetched from database:', user);

      if (user) {
        req.user = user; // Ajoutez l'utilisateur à la requête
        next();
      } else {
        console.log('User not found for ID:', decodedToken.id);
        res.clearCookie('jwt');
        return res.redirect('/'); // Utilisez 'return' pour arrêter l'exécution ici
      }
    } catch (e) {
      console.error('Error during token verification:', e);
      res.clearCookie('jwt'); // Supprimez le cookie en cas d'erreur
      return res.redirect('/'); // Utilisez 'return' pour arrêter l'exécution ici
    }
  } else {
    console.log('No token found, proceeding without user authentication.');
    next(); // Si aucun token n'est trouvé, passez à la suite
  }
};


const addJwtFeatures = (req, res, next) => {
  console.log('Adding JWT features to request');
  req.isAuthenticated = () => !!req.user;
  req.logout = () => res.clearCookie('jwt');
  req.login = (user) => {
    const token = createJwtToken({ user });
    res.cookie('jwt', token);
  };
  next();
};


module.exports = { extractUserFromToken, addJwtFeatures };
