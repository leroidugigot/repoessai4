const Formation = require("../database/models/formation.model");
const User = require("../database/models/user.model");

exports.getCurrentState = async (req, res) => {
  const { formationId, moduleId } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const formation = await Formation.findById(formationId);

    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    const formationProgress = user.local.formations.find(
      (f) => f.formation.toString() === formationId
    );

    if (!formationProgress) {
      return res.json({
        state: {
          videoProgress: 0,
          readingTime: 0,
          quizScore: 0,
          conditions: {
            videoWatched: false,
            timeSpentReading: false,
            quizPassed: false,
          },
        },
      });
    }

    const moduleProgress = formationProgress.progression.find(
      (p) => p.module.toString() === moduleId
    );

    const state = {
      videoProgress: moduleProgress?.videoProgress || 0,
      readingTime: moduleProgress?.readingTime || 0,
      quizScore: moduleProgress?.quiz?.score || 0,
      conditions: {
        videoWatched: moduleProgress?.videoWatched || false,
        timeSpentReading: moduleProgress?.timeSpentReading || false,
        quizPassed: moduleProgress?.quiz?.passed || false,
      },
    };

    return res.json({ state });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

exports.validateQuiz = async (req, res) => {
  const { formationId, moduleId } = req.params;
  const { answers } = req.body;
  const userId = req.user._id;

  try {
    const formation = await Formation.findById(formationId);
    const module = formation.modules.find((m) => m._id.toString() === moduleId);

    if (!module || !module.contenu.quiz) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }

    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === module.contenu.quiz[index].reponseCorrecte) {
        correctAnswers++;
      }
    });

    const score = Math.round(
      (correctAnswers / module.contenu.quiz.length) * 100
    );

    // Sauvegarder le score
    const user = await User.findById(userId);
    const formationIndex = user.local.formations.findIndex(
      (f) => f.formation.toString() === formationId
    );

    if (formationIndex === -1) {
      return res
        .status(404)
        .json({ message: "Formation non trouvée pour l'utilisateur" });
    }

    const moduleProgressIndex = user.local.formations[
      formationIndex
    ].progression.findIndex((p) => p.module.toString() === moduleId);

    if (moduleProgressIndex === -1) {
      user.local.formations[formationIndex].progression.push({
        module: moduleId,
        quiz: {
          score,
          passed: score === 100,
          attempts: 1,
          lastAttempt: new Date(),
        },
      });
    } else {
      user.local.formations[formationIndex].progression[
        moduleProgressIndex
      ].quiz = {
        score,
        passed: score === 100,
        attempts:
          (user.local.formations[formationIndex].progression[
            moduleProgressIndex
          ].quiz?.attempts || 0) + 1,
        lastAttempt: new Date(),
      };
    }

    await user.save();

    return res.json({
      score,
      passed: score === 100,
      message:
        score === 100
          ? "Félicitations ! Vous avez réussi le quiz !"
          : `Vous avez obtenu ${score}%. Continuez vos efforts !`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

exports.updateReadingProgress = async (req, res) => {
  const { formationId, moduleId } = req.params;
  const { readingTime, scrollPercentage } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const formationIndex = user.local.formations.findIndex(
      (f) => f.formation.toString() === formationId
    );

    if (formationIndex === -1) {
      return res
        .status(404)
        .json({ message: "Formation non trouvée pour l'utilisateur" });
    }

    let moduleProgress = user.local.formations[formationIndex].progression.find(
      (p) => p.module.toString() === moduleId
    );

    if (!moduleProgress) {
      moduleProgress = {
        module: moduleId,
        readingTime: 0,
        timeSpentReading: false,
        lastReadingProgress: new Date(),
      };
      user.local.formations[formationIndex].progression.push(moduleProgress);
    }

    moduleProgress.readingTime = readingTime;
    moduleProgress.timeSpentReading =
      readingTime >= 180 || scrollPercentage > 70;
    moduleProgress.lastReadingProgress = new Date();

    await user.save();

    return res.json({
      readingTime,
      timeSpentReading: moduleProgress.timeSpentReading,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

exports.updateVideoProgress = async (req, res) => {
  const { formationId, moduleId } = req.params;
  const { progress } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const formationIndex = user.local.formations.findIndex(
      (f) => f.formation.toString() === formationId
    );

    if (formationIndex === -1) {
      return res
        .status(404)
        .json({ message: "Formation non trouvée pour l'utilisateur" });
    }

    let moduleProgress = user.local.formations[formationIndex].progression.find(
      (p) => p.module.toString() === moduleId
    );

    if (!moduleProgress) {
      moduleProgress = {
        module: moduleId,
        videoProgress: 0,
        videoWatched: false,
        lastVideoProgress: new Date(),
      };
      user.local.formations[formationIndex].progression.push(moduleProgress);
    }

    moduleProgress.videoProgress = progress;
    moduleProgress.videoWatched = progress >= 70;
    moduleProgress.lastVideoProgress = new Date();

    await user.save();

    return res.json({
      videoProgress: progress,
      videoWatched: moduleProgress.videoWatched,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getModuleLockStatus = async (req, res) => {
  const { formationId, moduleId } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const formation = await Formation.findById(formationId);

    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    // Trouver l'index du module actuel
    const moduleIndex = formation.modules.findIndex(
      (m) => m._id.toString() === moduleId
    );

    if (moduleIndex === -1) {
      return res.status(404).json({ message: "Module non trouvé" });
    }

    // Le premier module est toujours déverrouillé
    if (moduleIndex === 0) {
      return res.json({ 
        isLocked: false,
        message: "Premier module - Accès autorisé"
      });
    }

    // Vérifier si tous les modules précédents sont complétés
    const formationProgress = user.local.formations.find(
      (f) => f.formation.toString() === formationId
    );

    if (!formationProgress) {
      return res.json({ 
        isLocked: true,
        message: "Vous devez d'abord vous inscrire à cette formation" 
      });
    }

    // Vérifier tous les modules précédents
    for (let i = 0; i < moduleIndex; i++) {
      const previousModuleId = formation.modules[i]._id;
      const previousModuleProgress = formationProgress.progression.find(
        (p) => p.module.toString() === previousModuleId.toString()
      );

      // Vérifier si le module précédent existe et si tous ses contenus sont validés
      if (!previousModuleProgress || 
          !previousModuleProgress.videoWatched || 
          !previousModuleProgress.timeSpentReading || 
          !previousModuleProgress.quiz?.passed) {
        
        return res.json({
          isLocked: true,
          message: `Vous devez d'abord compléter le module "${formation.modules[i].nom}"`,
          requiredContent: {
            video: !previousModuleProgress?.videoWatched,
            reading: !previousModuleProgress?.timeSpentReading,
            quiz: !previousModuleProgress?.quiz?.passed
          }
        });
      }
    }

    // Si tous les modules précédents sont complétés
    return res.json({
      isLocked: false,
      message: "Module accessible"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la vérification du statut du module",
      error: error.message,
    });
  }
};

exports.saveProgress = async (req, res) => {
  const { formationId, moduleId } = req.params;
  const { type, value } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const formationIndex = user.local.formations.findIndex(
      (f) => f.formation.toString() === formationId
    );

    if (formationIndex === -1) {
      return res
        .status(404)
        .json({ message: "Formation non trouvée pour l'utilisateur" });
    }

    let moduleProgress = user.local.formations[formationIndex].progression.find(
      (p) => p.module.toString() === moduleId
    );

    if (!moduleProgress) {
      moduleProgress = {
        module: moduleId,
        videoProgress: 0,
        readingTime: 0,
        videoWatched: false,
        timeSpentReading: false,
        quiz: { score: 0, passed: false },
        lastProgress: new Date(),
      };
      user.local.formations[formationIndex].progression.push(moduleProgress);
    }

    // Mettre à jour la progression en fonction du type
    switch (type) {
      case "video":
        moduleProgress.videoProgress = value;
        moduleProgress.videoWatched = value >= 70;
        break;
      case "reading":
        moduleProgress.readingTime = value;
        moduleProgress.timeSpentReading = value >= 180;
        break;
      case "quiz":
        moduleProgress.quiz = {
          score: value,
          passed: value === 100,
          lastAttempt: new Date(),
        };
        break;
      default:
        return res
          .status(400)
          .json({ message: "Type de progression invalide" });
    }

    moduleProgress.lastProgress = new Date();
    await user.save();

    return res.json({
      type,
      value,
      conditions: {
        videoWatched: moduleProgress.videoWatched,
        timeSpentReading: moduleProgress.timeSpentReading,
        quizPassed: moduleProgress.quiz?.passed || false,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};
