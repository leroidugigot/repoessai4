const mongoose = require("mongoose");
const Formation = require("./database/models/formation.model");
const { ObjectId } = mongoose.Types;

// Fonction de connexion à la base de données
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://familleaitbella:123@clustermomo.5krbhd5.mongodb.net/test",
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
      nom: "Formation Secourisme PSE1",
      description: `
              Cette formation vous permettra d'acquérir les compétences nécessaires pour devenir secouriste PSE1 (Prévention et Secours Civiques de niveau 1). Vous apprendrez à protéger, alerter et secourir efficacement face à des situations d'urgence. À travers des mises en situation pratiques, vous serez capable de prendre en charge des victimes en attendant l'arrivée des secours.
          
              Les modules abordés dans cette formation sont :
              
              I. Introduction au secourisme PSE1
                - Importance des premiers secours et du rôle du secouriste
                - Cadre juridique et responsabilités du secouriste
                
              II. Protection et sécurité  
                - Reconnaissance et prévention des dangers
                - Protection de soi-même et des victimes
                
              III. Bilan et alerte
                - Évaluation de la situation et des victimes
                - Transmission de l'alerte et interaction avec les secours
                
              IV. Prise en charge des détresses vitales
                - Gestion d'une victime inconsciente
                - Réanimation cardio-pulmonaire et défibrillation
                - Prise en charge d'hémorragies externes
            `,
      modules: [
        {
          _id: new ObjectId(),
          moduleId: "moduleA1",
          nom: "Introduction au secourisme PSE1",
          description:
            "Ce module couvre les bases du secourisme PSE1, en présentant l'importance des premiers secours, le rôle du secouriste et le cadre juridique associé.",
          ordre: 1,
          contenu: {
            video: "https://youtu.be/orbkg5JH9C8?si=PQSdmLfxbkEBRUZG",
            cours: `
Formation Secourisme PSE1
Introduction
La formation PSE1 (Prévention et Secours Civiques de niveau 1) est une qualification essentielle pour devenir secouriste. Ce cours vous permettra d'acquérir les compétences nécessaires pour intervenir efficacement dans des situations d'urgence.
Module 1 : Introduction au Secourisme PSE1
1.1 L'importance des Premiers Secours
1.1.1 Définition des Premiers Secours
Les premiers secours représentent l'ensemble des gestes et actions immédiates réalisés par une personne auprès d'une victime, avant l'arrivée des services de secours professionnels. Ces interventions peuvent être déterminantes pour la survie ou l'état de santé ultérieur de la victime.
1.1.2 Objectifs des Premiers Secours

Préserver la vie
Empêcher l'aggravation de l'état de la victime
Favoriser la récupération de la victime
Contribuer à la chaîne de survie

1.1.3 Le Secouriste comme Maillon Essentiel
Le secouriste joue un rôle crucial dans la chaîne des secours en tant que premier intervenant. Sa rapidité d'action et la pertinence de ses gestes peuvent faire la différence dans les premières minutes critiques d'une urgence.
1.2 Cadre Juridique et Responsabilités
1.2.1 Droits et Devoirs du Secouriste

Obligation d'assistance à personne en danger
Limites de l'intervention
Respect du cadre légal d'intervention

1.2.2 Protection juridique

Couverture légale des actes de secourisme
Responsabilité civile et pénale
Cas de force majeure et état de nécessité

1.2.3 Confidentialité

Respect du secret professionnel
Protection des informations personnelles
Communication appropriée avec les services de secours

Module 2 : Protection et Sécurité
2.1 Reconnaissance et Prévention des Dangers
2.1.1 Identification des risques

Dangers immédiats
Risques potentiels
Évaluation de l'environnement

2.1.2 Sécurisation de la Zone

Périmètre de sécurité
Balisage
Élimination des dangers si possible

2.2 Protection des Intervenants et des Victimes
2.2.1 Équipements de protection

Équipements de protection individuelle (EPI)
Utilisation appropriée du matériel
Maintenance et vérification des équipements

2.2.2 Techniques de protection

Positionnement de sécurité
Distances d'intervention
Gestes et postures adaptés

Module 3 : Bilan et Alerte
3.1 Réalisation du Bilan
3.1.1 Bilan Circonstanciel

Analyse de la situation
Recherche des causes
Évaluation des risques persistants

3.1.2 Bilan d'Urgence Vitale

Conscience
Respiration
Circulation

3.1.3 Bilan complémentaire

Signes et symptômes
Antécédents médicaux
Traitements en cours

3.2 Transmission de l'alerte
3.2.1 Procédure d'alerte

Numéros d'urgence (15, 18, 112)
Message d'alerte structuré
Informations essentielles à transmettre

3.2.2 Suivi de l'intervention

Communication avec les services de secours
Surveillance de la victime
Transmission des évolutions

Conclusion
La formation PSE1 vous donne les bases essentielles pour intervenir efficacement en tant que secouriste. 
La maîtrise de ces compétences nécessite une pratique régulière et une mise à jour continue des connaissances. 
                  `,
            quiz: [
              {
                _id: new ObjectId(),
                question:
                  "Quel est le premier maillon de la chaîne des secours ?",
                options: ["Alerter", "Protéger", "Secourir", "Transporter"],
                answer: "Protéger",
              },
              {
                _id: new ObjectId(),
                question: "Le secouriste est soumis au secret professionnel.",
                options: ["Vrai", "Faux"],
                answer: "Vrai",
              },
            ],
          },
        },
        {
          _id: new ObjectId(),
          moduleId: "moduleA2",
          nom: "Protection et sécurité",
          description:
            "Ce module aborde la protection des intervenants et des victimes, ainsi que la sécurisation de la zone d'intervention.",
          ordre: 2,
          contenu: {
            video: "https://youtu.be/ZkK5IpAn_m8",
            cours: `
                    I. Reconnaissance et prévention des dangers
                      A. Identification des différents types de dangers
                      B. Évaluation des risques pour soi-même et les victimes
                      C. Sécurisation de la zone d'intervention
                        
                    II. Protection de soi-même et d'autrui
                      A. Utilisation des équipements de protection individuelle  
                      B. Consignes de sécurité et distances de sécurité
                      C. Dégagement d'urgence et mise en sécurité des victimes    
                  `,
            quiz: [
              {
                _id: new ObjectId(),
                question:
                  "Face à un danger persistant, quelle est la priorité ?",
                options: [
                  "Dégager la victime",
                  "Alerter les secours",
                  "Supprimer le danger",
                  "Réaliser un bilan",
                ],
                answer: "Supprimer le danger",
              },
            ],
          },
        },
        {
          _id: new ObjectId(),
          moduleId: "moduleA3",
          nom: "Bilan et alerte",
          description:
            "Ce module présente la réalisation du bilan de la situation et des victimes, ainsi que la transmission de l'alerte aux services de secours.",
          ordre: 3,
          contenu: {
            video: "https://youtu.be/ZL99iCmfAsk",
            cours: `
                    I. Bilan de la situation et des victimes
                      A. Bilan circonstanciel et évaluation du contexte
                      B. Bilan d'urgence vitale et bilan complémentaire
                      C. Reconnaissance des signes de détresse et de gravité
                      
                    II. Alerte et transmission aux services de secours  
                      A. Numéros d'urgence et modalités d'alerte
                      B. Message d'alerte et informations essentielles
                      C. Interaction et suivi des consignes des secours
                  `,
            quiz: [
              {
                _id: new ObjectId(),
                question: "Quel est le numéro d'urgence européen unique ?",
                options: ["15", "17", "18", "112"],
                answer: "112",
              },
              {
                _id: new ObjectId(),
                question: "Dans quel ordre réalise-t-on le bilan ?",
                options: [
                  "Bilan circonstanciel, bilan d'urgence vitale, bilan complémentaire",
                  "Bilan d'urgence vitale, bilan complémentaire, bilan circonstanciel",
                  "Bilan complémentaire, bilan circonstanciel, bilan d'urgence vitale",
                ],
                answer:
                  "Bilan circonstanciel, bilan d'urgence vitale, bilan complémentaire",
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
      description:
        "Apprenez à programmer en Python, un langage populaire et polyvalent.",
      modules: [
        {
          _id: new ObjectId(),
          moduleId: "moduleB1",
          nom: "Introduction à Python",
          description:
            "Ce module couvre les bases de la programmation en Python.",
          ordre: 1, // Ajout du champ ordre
          contenu: {
            video: "https://www.youtube.com/watch?v=videoB1",
            cours:
              "Introduction aux variables, types de données et fonctions en Python.",
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
          description:
            "Apprenez à utiliser les boucles et les conditions en Python.",
          ordre: 2, // Ajout du champ ordre
          contenu: {
            video: "https://www.youtube.com/watch?v=videoB2",
            cours:
              "Ce module explore les instructions conditionnelles et les boucles en Python.",
            quiz: [
              {
                _id: new ObjectId(),
                question:
                  "Quelle boucle est utilisée pour parcourir une liste ?",
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
        },
        {
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
        },
        {
          _id: new ObjectId(),
          moduleId: "modudfgh1",
          nom: "Introduction à Python",
          description:
            "Ce module couvre les bases de la programmation en Python.",
          ordre: 4, // Ajout du champ ordre
          contenu: {
            video: "https://www.youtube.com/watch?v=videoB1",
            cours:
              "Introduction aux variables, types de données et fonctions en Python.",
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
          moduleId: "modudfgh1",
          nom: "Introduction à Python",
          description:
            "Ce module couvre les bases de la programmation en Python.",
          ordre: 5, // Ajout du champ ordre
          contenu: {
            video: "https://www.youtube.com/watch?v=videoB1",
            cours:
              "Introduction aux variables, types de données et fonctions en Python.",
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
          moduleId: "modudfgh1",
          nom: "Introduction à Python",
          description:
            "Ce module couvre les bases de la programmation en Python.",
          ordre: 6, // Ajout du champ ordre
          contenu: {
            video: "https://www.youtube.com/watch?v=videoB1",
            cours:
              "Introduction aux variables, types de données et fonctions en Python.",
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
          moduleId: "modudfgh1",
          nom: "Introduction à Python",
          description:
            "Ce module couvre les bases de la programmation en Python.",
          ordre: 7, // Ajout du champ ordre
          contenu: {
            video: "https://www.youtube.com/watch?v=videoB1",
            cours:
              "Introduction aux variables, types de données et fonctions en Python.",
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
          moduleId: "modudfgh1",
          nom: "Introduction à Python",
          description:
            "Ce module couvre les bases de la programmation en Python.",
          ordre: 8, // Ajout du champ ordre
          contenu: {
            video: "https://www.youtube.com/watch?v=videoB1",
            cours:
              "Introduction aux variables, types de données et fonctions en Python.",
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
          moduleId: "modudfgh1",
          nom: "Introduction à Python",
          description:
            "Ce module couvre les bases de la programmation en Python.",
          ordre: 9, // Ajout du champ ordre
          contenu: {
            video: "https://www.youtube.com/watch?v=videoB1",
            cours:
              "Introduction aux variables, types de données et fonctions en Python.",
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
          moduleId: "modudfgh1",
          nom: "Introduction à Python",
          description:
            "Ce module couvre les bases de la programmation en Python.",
          ordre: 10, // Ajout du champ ordre
          contenu: {
            video: "https://www.youtube.com/watch?v=videoB1",
            cours:
              "Introduction aux variables, types de données et fonctions en Python.",
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
