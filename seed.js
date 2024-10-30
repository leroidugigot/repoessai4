const mongoose = require('mongoose');
const Formation = require('./database/models/formation.model');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://familleaitbella:123@clustermomo.5krbhd5.mongodb.net/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

const seedData = async () => {
    await connectDB();

    // Supprimer les anciennes données
    await Formation.deleteMany({});

    // Création des formations
    const formation1 = new Formation({
        formationId: "formation1",
        nom: "Formation 1",
        modules: [
            {
                moduleId: "moduleA1",
                nom: "Module A1",
                contenu: {
                    video: "https://www.youtube.com/watch?v=videoA1",
                    cours: "Cours A1 en 20 mots sur le module A1.",
                    quiz: [
                        {
                            question: "Question 1 sur A1?",
                            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                            answer: "Option 1"
                        },
                        {
                            question: "Question 2 sur A1?",
                            options: ["Option A", "Option B", "Option C", "Option D"],
                            answer: "Option B"
                        }
                    ]
                }
            },
            {
                moduleId: "moduleA2",
                nom: "Module A2",
                contenu: {
                    video: "https://www.youtube.com/watch?v=videoA2",
                    cours: "Cours A2 en 20 mots sur le module A2.",
                    quiz: [
                        {
                            question: "Question 1 sur A2?",
                            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                            answer: "Option 1"
                        },
                        {
                            question: "Question 2 sur A2?",
                            options: ["Option A", "Option B", "Option C", "Option D"],
                            answer: "Option B"
                        }
                    ]
                }
            }
        ]
    });

    const formation2 = new Formation({
        formationId: "formation2",
        nom: "Formation 2",
        modules: [
            {
                moduleId: "moduleB1",
                nom: "Module B1",
                contenu: {
                    video: "https://www.youtube.com/watch?v=videoB1",
                    cours: "Cours B1 en 20 mots sur le module B1.",
                    quiz: [
                        {
                            question: "Question 1 sur B1?",
                            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                            answer: "Option 1"
                        },
                        {
                            question: "Question 2 sur B1?",
                            options: ["Option A", "Option B", "Option C", "Option D"],
                            answer: "Option B"
                        }
                    ]
                }
            },
            {
                moduleId: "moduleB2",
                nom: "Module B2",
                contenu: {
                    video: "https://www.youtube.com/watch?v=videoB2",
                    cours: "Cours B2 en 20 mots sur le module B2.",
                    quiz: [
                        {
                            question: "Question 1 sur B2?",
                            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                            answer: "Option 1"
                        },
                        {
                            question: "Question 2 sur B2?",
                            options: ["Option A", "Option B", "Option C", "Option D"],
                            answer: "Option B"
                        }
                    ]
                }
            }
        ]
    });

    await formation1.save();
    await formation2.save();

    console.log("Données insérées avec succès !");
    mongoose.connection.close();
};

seedData().catch(err => console.error("Erreur lors de l'insertion des données :", err));
