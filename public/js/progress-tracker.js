class ProgressTracker {
  constructor() {
    this.state = {
      videoProgress: 0,
      readingTime: 0,
      quizScore: 0,
      videoWatched: false,
      timeSpentReading: false,
      quizPassed: false
    };
    this.currentFormationId = null;
    this.currentModuleId = null;
  }

  async initializeState(formationId, moduleId) {
    try {
      console.log("Initialisation de l'état pour:", { formationId, moduleId });
      
      if (!formationId || !moduleId) {
        console.error("IDs manquants pour l'initialisation");
        return;
      }

      this.currentFormationId = formationId;
      this.currentModuleId = moduleId;

      const response = await fetch(`/api/content/module-progress/${formationId}/${moduleId}`);
      if (!response.ok) throw new Error("Erreur lors de la récupération de la progression");
      
      const progress = await response.json();
      console.log("État initial récupéré:", progress);

      // Mise à jour de l'état
      this.state = {
        videoProgress: progress.videoProgress || 0,
        readingTime: progress.readingTime || 0,
        quizScore: progress.quizScore || 0,
        videoWatched: progress.videoWatched || false,
        timeSpentReading: progress.timeSpentReading || false,
        quizPassed: progress.quizPassed || false
      };

      // Mettre à jour l'interface
      if (window.UI) {
        window.UI.updateProgressUI(this.state);
      }

      return this.state;
    } catch (error) {
      console.error("Erreur d'initialisation:", error);
      throw error;
    }
  }

  // ... reste du code ...
} 