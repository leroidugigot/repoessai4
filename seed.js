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
            nom: "Formation GQS",
            description: "descritpion ggs    secouri gfhjfgj la sécurité et le bien-êtrghjsecours professionnels. Ces gestes incluent la réanimation cardio-pulmonaire (RCP), la prise en charge des blessures, et la gestion des situations d'urgence telles que l'étouffement ou les brûlures. Apprendre ces gestes permet de sauver des vies en apportant une assistance immédiate et appropriée lors d'un accident ou d'une urgence médicale.",
            modules: []
        }),
        new Formation({
            formationId: "formation ",
            nom: "Formation PSC 1",
            description: "description psc1  s er la sécurité et le bien-être d'une personne en détresse avant l'arrivée des secours professionnels. Ces gestes incluent la réanimation cardio-pulmonaire (RCP), la prise en charge des blessures, et la gestion des situations d'urgence telles que l'étouffement ou les brûlures. Apprendre ces gestes permet de sauver des vies en apportant une assistance immédiate et appropriée lors d'un accident ou d'une urgence médicale.",

            modules: []
        }),
        new Formation({
            formationId: "formation3",
            nom: "Formation PSE 1",
            description: "Les GQS (Gestes de Secours) en secourisme sont des actions essefghjgjrer la sécurité et le bien-être d'une personne en détresse avant l'arrivée des secours professionnels. Ces gestes incluent la réanimation cardio-pulmonaire (RCP), la prise en charge des blessures, et la gestion des situations d'urgence telles que l'étouffement ou les brûlures. Apprendre ces gestes permet de sauver des vies en apportant une assistance immédiate et appropriée lors d'un accident ou d'une urgence médicale.",

            modules: []
        }),
        new Formation({
            formationId: "formation4",
            nom: "Formation PSE 2",
            description: "Les GQS (Gestes de Secours) en secourisme sont des actions essentielles à réaliser pour assurer la sécurité et le bien-être d'une personne en détresse avant l'arrivée des secours professionnels. Ces gestes incluent la réanimation cardio-pulmonaire (RCP), la prise en charge des blessures, et la gestion des situations d'urgence telles que l'étouffement ou les brûlures. Apprendre ces gestes permet de sauver des vies en apportant une assistance immédiate et appropriée lors d'un accident ou d'une urgence médicale.",

            modules: []
        }),
        new Formation({
            formationId: "formation5",
            nom: "Formation BNSSA",
            description: "Les GQS (Gestes de Secours) en secourisme sont des actions essentjkhjkarrivée des secours professionnels. Ces gestes incluent la réanimation cardio-pulmonaire (RCP), la prise en charge des blessures, et la gestion des situations d'urgence telles que l'étouffement ou les brûlures. Apprendre ces gestes permet de sauver des vies en apportant une assistance immédiate et appropriée lors d'un accident ou d'une urgence médicale.",

            modules: []
        }),
        new Formation({
            formationId: "formation6",
            nom: "Formation 6",
            description: "Les GQS (Gestes de Secours) en secourisme sont des actions essentielles à réaliser pour assurer la sécuritghjhjhjétresse avant l'arrivée des secours professionnels. Ces gestes incluent la réanimation cardio-pulmonaire (RCP), la prise en charge des blessures, et la gestion des situations d'urgence telles que l'étouffement ou les brûlures. Apprendre ces gestes permet de sauver des vies en apportant une assistance immédiate et appropriée lors d'un accident ou d'une urgence médicale.",

            modules: []
        })
    ];

    // Pour chaque fichier de module, charger les données et les ajouter aux formations correspondantes
    for (const file of moduleFiles) {
        if (file.endsWith('.json')) {
            let moduleData;
            try {
                moduleData = JSON.parse(await fs.readFile(path.join('./modules', file), 'utf-8'));
            } catch (err) {
                console.error(`Erreur lors du parsing du fichier ${file}: ${err.message}`);
                continue; // Passe au fichier suivant en cas d'erreur
            }

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
