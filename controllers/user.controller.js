const { createUser } = require('../queries/user.queries');
const { verifyCaptcha } = require('../config/recaptcha.config'); // Import du fichier reCAPTCHA
const User = require('../database/models/user.model'); // Ajoutez cette ligne

exports.userNew = (req, res, next) => {
  const siteKey = process.env.RECAPTCHA_SITE_KEY; // Assurez-vous d'avoir cette variable dans votre fichier .env
  res.render('signup', { error: null, siteKey });
};

exports.userCreate = async (req, res, next) => {
  try {
    const body = req.body;

    // Vérification du CAPTCHA via recaptcha.config.js
    await verifyCaptcha(req.body['g-recaptcha-response']);

    // Création de l'utilisateur via user.query.js
    const user = await createUser(body);

    // Connexion de l'utilisateur avec JWT
    req.login(user);

    // Redirection vers la page protégée après création
    res.redirect('/protected');
  } catch (e) {
    console.error('Error during user creation:', e.message);
    res.render('signup', { error: e.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
      const userId = req.user._id;
      const user = await User.findById(userId)
          .populate('local.formations.formation')
          .populate('local.formations.progression.module');

      if (!user) {
          return res.status(404).send('Utilisateur non trouvé');
      }

      // Calcul des statistiques
      const stats = {
          completedModules: 0,
          averageQuizScore: 0,
          totalTimeSpent: 0
      };

      if (user.local.formations) {
          // Calcul des modules complétés
          stats.completedModules = user.local.formations.reduce((total, formation) => {
              return total + (formation.progression?.filter(p => p.completed)?.length || 0);
          }, 0);

          // Calcul de la moyenne des quiz
          let totalScore = 0;
          let quizCount = 0;
          user.local.formations.forEach(formation => {
              formation.progression?.forEach(progress => {
                  if (progress.quiz?.score) {
                      totalScore += progress.quiz.score;
                      quizCount++;
                  }
              });
          });
          stats.averageQuizScore = quizCount > 0 ? Math.round(totalScore / quizCount) : 0;

          // Calcul du temps total
          stats.totalTimeSpent = user.local.formations.reduce((total, formation) => {
              return total + (formation.progression?.reduce((moduleTime, progress) => {
                  return progress.completedAt ? moduleTime + 2 : moduleTime;
              }, 0) || 0);
          }, 0);
      }

      res.render('partials/profile', { 
          user,
          stats,
          currentDate: new Date()
      });
  } catch (error) {
      console.error('Error loading profile:', error);
      res.status(500).send('Erreur lors du chargement du profil');
  }
};