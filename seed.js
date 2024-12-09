const mongoose = require('mongoose');
const Formation = require('./database/models/formation.model');
const { ObjectId } = mongoose.Types;

// Fonction de connexion à la base de données
const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://familleaitbella:123@clustermomo.5krbhd5.mongodb.net/test',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("Connecté à MongoDB avec succès !");
    } catch (err) {
        console.error("Erreur de connexion à MongoDB :", err);
        process.exit(1);
    }
};

// Fonction de seed des données
const seedData = async () => {
    await connectDB();

    try {
        // Supprimer les anciennes données
        await Formation.deleteMany({});
        console.log("Anciennes données supprimées avec succès.");

        // Création des formations
        const formation1 = new Formation({
            _id: new ObjectId(),
            formationId: "formation1",
            nom: "Formation Développement Web",
            description: "Formation complète pour apprendre les bases du développement web.",
            modules: [
                {
                    _id: new ObjectId(),
                    moduleId: "moduleA1",
                    nom: "Introduction au HTML",
                    description: "Ce module couvre les bases du langage HTML pour créer des pages web.",
                    ordre: 1, // Ajout du champ ordre
                    contenu: {
                        video: "https://youtu.be/orbkg5JH9C8?si=PQSdmLfxbkEBRUZG",
                        cours: " aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                
                        quiz: [
                            {
                                _id: new ObjectId(),
                                question: "Qu'est-ce qu'une balise HTML ?",
                                options: ["Une balise", "Un attribut", "Un style", "Un script"],
                                answer: "Une balise",
                            },
                            {
                                _id: new ObjectId(),
                                question: "Qu'est-ce qu'une balise HTML ?",
                                options: ["Une balise", "Un attribut", "Un style", "Un script"],
                                answer: "Une balise",
                            },
                        ],
                    },
                },
                {
                    _id: new ObjectId(),
                    moduleId: "moduleA2",
                    nom: "CSS pour la mise en page",
                    description: "Découvrez comment styliser et mettre en page des sites web avec CSS.",
                    ordre: 2, // Ajout du champ ordre
                    contenu: {
                        video: "https://www.youtube.com/watch?v=videoA2",
                        cours: "Ce cours explique les bases du CSS pour le style et la mise en page.",
                        quiz: [
                            {
                                _id: new ObjectId(),
                                question: "Quelle propriété CSS est utilisée pour la couleur du texte ?",
                                options: ["color", "background-color", "font-size", "text-align"],
                                answer: "color",
                            },
                            {
                                _id: new ObjectId(),
                                question: "Comment appliquer une bordure en CSS ?",
                                options: ["border", "outline", "margin", "padding"],
                                answer: "border",
                            },
                        ],
                    },
                },
            ],
        });

        const formation2 = new Formation({
            _id: new ObjectId(),
            formationId: "formation2",
            nom: "Formation Python pour débutants",
            description: "Apprenez à programmer en Python, un langage populaire et polyvalent.",
            modules: [
                {
                    _id: new ObjectId(),
                    moduleId: "moduleB1",
                    nom: "Introduction à Python",
                    description: "Ce module couvre les bases de la programmation en Python.",
                    ordre: 1, // Ajout du champ ordre
                    contenu: {
                        video: "https://www.youtube.com/watch?v=videoB1",
                        cours: "Introduction aux variables, types de données et fonctions en Python.",
                        quiz: [
                            {
                                _id: new ObjectId(),
                                question: "Quel est le type de données pour 42 ?",
                                options: ["int", "float", "string", "bool"],
                                answer: "int",
                            },
                            {
                                _id: new ObjectId(),
                                question: "Comment définir une fonction en Python ?",
                                options: ["def", "function", "func", "lambda"],
                                answer: "def",
                            },
                        ],
                    },
                },
                {
                    _id: new ObjectId(),
                    moduleId: "moduleB2",
                    nom: "Structures de contrôle en Python",
                    description: "Apprenez à utiliser les boucles et les conditions en Python.",
                    ordre: 2, // Ajout du champ ordre
                    contenu: {
                        video: "https://www.youtube.com/watch?v=videoB2",
                        cours: "Ce module explore les instructions conditionnelles et les boucles en Python.",
                        quiz: [
                            {
                                _id: new ObjectId(),
                                question: "Quelle boucle est utilisée pour parcourir une liste ?",
                                options: ["for", "while", "do-while", "foreach"],
                                answer: "for",
                            },
                            {
                                _id: new ObjectId(),
                                question: "Comment écrire une condition en Python ?",
                                options: ["if", "when", "switch", "case"],
                                answer: "if",
                            },
                        ],
                    },
                },{
                    _id: new ObjectId(),
                    moduleId: "modulghj1",
                    nom: "Introdughjython",
                    description: "Ce moduleghj programmation en Python.",
                    ordre: 3, // Ajout du champ ordre
                    contenu: {
                        video: "https://www.youtube.com/watch?v=videoB1",
                        cours: "Introduction ghjet fonctions en Python.",
                        quiz: [
                            {
                                _id: new ObjectId(),
                                question: "Quel esghj de données pour 42 ?",
                                options: ["int", "float", "string", "bool"],
                                answer: "int",
                            },
                            {
                                _id: new ObjectId(),
                                question: "Comment défighjonction en Python ?",
                                options: ["def", "function", "func", "lambda"],
                                answer: "def",
                            },
                        ],
                    },
                },{
                    _id: new ObjectId(),
                    moduleId: "modudfgh1",
                    nom: "Introduction à Python",
                    description: "Ce module couvre les bases de la programmation en Python.",
                    ordre: 4, // Ajout du champ ordre
                    contenu: {
                        video: "https://www.youtube.com/watch?v=videoB1",
                        cours: "Introduction aux variables, types de données et fonctions en Python.",
                        quiz: [
                            {
                                _id: new ObjectId(),
                                question: "Quel est le type de données pour 42 ?",
                                options: ["int", "float", "string", "bool"],
                                answer: "int",
                            },
                            {
                                _id: new ObjectId(),
                                question: "Comment définir une fonction en Python ?",
                                options: ["def", "function", "func", "lambda"],
                                answer: "def",
                            },
                        ],
                    },
                },{
                    _id: new ObjectId(),
                    moduleId: "modudfgh1",
                    nom: "Introduction à Python",
                    description: "Ce module couvre les bases de la programmation en Python.",
                    ordre: 5, // Ajout du champ ordre
                    contenu: {
                        video: "https://www.youtube.com/watch?v=videoB1",
                        cours: "Introduction aux variables, types de données et fonctions en Python.",
                        quiz: [
                            {
                                _id: new ObjectId(),
                                question: "Quel est le type de données pour 42 ?",
                                options: ["int", "float", "string", "bool"],
                                answer: "int",
                            },
                            {
                                _id: new ObjectId(),
                                question: "Comment définir une fonction en Python ?",
                                options: ["def", "function", "func", "lambda"],
                                answer: "def",
                            },
                        ],
                    },
                }, {
                    _id: new ObjectId(),
                    moduleId: "modudfgh1",
                    nom: "Introduction à Python",
                    description: "Ce module couvre les bases de la programmation en Python.",
                    ordre: 6, // Ajout du champ ordre
                    contenu: {
                        video: "https://www.youtube.com/watch?v=videoB1",
                        cours: "Introduction aux variables, types de données et fonctions en Python.",
                        quiz: [
                            {
                                _id: new ObjectId(),
                                question: "Quel est le type de données pour 42 ?",
                                options: ["int", "float", "string", "bool"],
                                answer: "int",
                            },
                            {
                                _id: new ObjectId(),
                                question: "Comment définir une fonction en Python ?",
                                options: ["def", "function", "func", "lambda"],
                                answer: "def",
                            },
                        ],
                    },
                },  {
                    _id: new ObjectId(),
                    moduleId: "modudfgh1",
                    nom: "Introduction à Python",
                    description: "Ce module couvre les bases de la programmation en Python.",
                    ordre: 7, // Ajout du champ ordre
                    contenu: {
                        video: "https://www.youtube.com/watch?v=videoB1",
                        cours: "Introduction aux variables, types de données et fonctions en Python.",
                        quiz: [
                            {
                                _id: new ObjectId(),
                                question: "Quel est le type de données pour 42 ?",
                                options: ["int", "float", "string", "bool"],
                                answer: "int",
                            },
                            {
                                _id: new ObjectId(),
                                question: "Comment définir une fonction en Python ?",
                                options: ["def", "function", "func", "lambda"],
                                answer: "def",
                            },
                        ],
                    },
                }, {
                    _id: new ObjectId(),
                    moduleId: "modudfgh1",
                    nom: "Introduction à Python",
                    description: "Ce module couvre les bases de la programmation en Python.",
                    ordre: 8, // Ajout du champ ordre
                    contenu: {
                        video: "https://www.youtube.com/watch?v=videoB1",
                        cours: "Introduction aux variables, types de données et fonctions en Python.",
                        quiz: [
                            {
                                _id: new ObjectId(),
                                question: "Quel est le type de données pour 42 ?",
                                options: ["int", "float", "string", "bool"],
                                answer: "int",
                            },
                            {
                                _id: new ObjectId(),
                                question: "Comment définir une fonction en Python ?",
                                options: ["def", "function", "func", "lambda"],
                                answer: "def",
                            },
                        ],
                    },
                }, {
                    _id: new ObjectId(),
                    moduleId: "modudfgh1",
                    nom: "Introduction à Python",
                    description: "Ce module couvre les bases de la programmation en Python.",
                    ordre: 9, // Ajout du champ ordre
                    contenu: {
                        video: "https://www.youtube.com/watch?v=videoB1",
                        cours: "Introduction aux variables, types de données et fonctions en Python.",
                        quiz: [
                            {
                                _id: new ObjectId(),
                                question: "Quel est le type de données pour 42 ?",
                                options: ["int", "float", "string", "bool"],
                                answer: "int",
                            },
                            {
                                _id: new ObjectId(),
                                question: "Comment définir une fonction en Python ?",
                                options: ["def", "function", "func", "lambda"],
                                answer: "def",
                            },
                        ],
                    },
                }, {
                    _id: new ObjectId(),
                    moduleId: "modudfgh1",
                    nom: "Introduction à Python",
                    description: "Ce module couvre les bases de la programmation en Python.",
                    ordre: 10, // Ajout du champ ordre
                    contenu: {
                        video: "https://www.youtube.com/watch?v=videoB1",
                        cours: "Introduction aux variables, types de données et fonctions en Python.",
                        quiz: [
                            {
                                _id: new ObjectId(),
                                question: "Quel est le type de données pour 42 ?",
                                options: ["int", "float", "string", "bool"],
                                answer: "int",
                            },
                            {
                                _id: new ObjectId(),
                                question: "Comment définir une fonction en Python ?",
                                options: ["def", "function", "func", "lambda"],
                                answer: "def",
                            },
                        ],
                    },
                }, 
            ],
        });

        // Enregistrement des formations
        await formation1.save();
        await formation2.save();

        console.log("Données insérées avec succès !");
    } catch (err) {
        console.error("Erreur lors de l'insertion des données :", err);
    } finally {
        mongoose.connection.close();
        console.log("Connexion MongoDB fermée.");
    }
};

// Exécuter le script de seed
seedData().catch((err) =>
    console.error("Erreur inattendue lors de l'exécution du seed :", err)
);
