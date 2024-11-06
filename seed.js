const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const Formation = require('./database/models/formation.model');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://familleaitbella:123@clustermomo.5krbhd5.mongodb.net/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

// Fonction pour créer des modules avec leur contenu
const createModule = (moduleData) => ({
    moduleId: moduleData.moduleId,
    nom: moduleData.nom,
    contenu: {
        video: moduleData.videoUrl,
        cours: moduleData.cours,
        quiz: moduleData.quiz
    }
});

const seedData = async () => {
    await connectDB();

    // Supprimer les anciennes données
    await Formation.deleteMany({});

    // Récupérer tous les fichiers de module depuis le répertoire
    const moduleFiles = await fs.readdir('./modules'); // 'modules' est le dossier contenant les fichiers JSON

    const formations = [
        new Formation({
            formationId: "formation1",
            nom: "Formation 1",
            modules: []
        }),
        new Formation({
            formationId: "formation2",
            nom: "Formation 2",
            modules: []
        }),
        new Formation({
            formationId: "formation3",
            nom: "Formation 3",
            modules: []
        }),
        new Formation({
            formationId: "formation4",
            nom: "Formation 4",
            modules: []
        }),
        new Formation({
            formationId: "formation5",
            nom: "Formation 5",
            modules: []
        }),
        new Formation({
            formationId: "formation6",
            nom: "Formation 6",
            modules: []
        })
    ];

    // Pour chaque fichier de module, charger les données et les ajouter aux formations correspondantes
    for (const file of moduleFiles) {
        if (file.endsWith('.json')) {
            const moduleData = JSON.parse(await fs.readFile(path.join('./modules', file), 'utf-8'));
            const module = createModule(moduleData);

            // Associer chaque module à sa formation
            if (moduleData.moduleId.includes('A')) {
                formations[0].modules.push(module);
                formations[1].modules.push(module); // Exemple : Ajouter ce module à plusieurs formations
            }
            else if (moduleData.moduleId.includes('B')) {
                formations[2].modules.push(module);
                formations[3].modules.push(module); // Exemple : Ajouter ce module à plusieurs formations
            }
            // Ajoutez ici d'autres règles pour les formations si nécessaire
        }
    }

    // Sauvegarde de toutes les formations
    for (const formation of formations) {
        await formation.save();
    }

    console.log("Données insérées avec succès !");
    mongoose.connection.close();
};

seedData().catch(err => console.error("Erreur lors de l'insertion des données :", err));
