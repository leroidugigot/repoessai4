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
      typeStyle: "formation-title",
      description: `
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Formation PSE1 (Prévention et Secours Civiques de niveau 1)</h2>
            <p class="text-gray-600 leading-relaxed mb-4">
              Cette formation vous permettra d'acquérir les compétences nécessaires pour devenir secouriste PSE1. 
              Vous apprendrez à protéger, alerter et secourir efficacement face à des situations d'urgence.
            </p>
            
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p class="font-semibold text-blue-700">Points clés de la formation :</p>
              <ul class="list-disc list-inside text-gray-700 mt-2 space-y-2">
                <li>Formation certifiante reconnue</li>
                <li>Apprentissage pratique avec mises en situation</li>
                <li>Encadrement par des formateurs expérimentés</li>
              </ul>
            </div>

            <div class="space-y-4">
              <h3 class="text-xl font-semibold text-gray-700">Modules de formation :</h3>
              <div class="grid gap-4 md:grid-cols-2">
                <div class="p-4 border rounded-lg bg-gray-50">
                  <h4 class="font-medium text-gray-800">I. Introduction au secourisme PSE1</h4>
                  <ul class="mt-2 space-y-1 text-gray-600">
                    <li>• Importance des premiers secours</li>
                    <li>• Cadre juridique et responsabilités</li>
                  </ul>
                </div>
                <div class="p-4 border rounded-lg bg-gray-50">
                  <h4 class="font-medium text-gray-800">II. Protection et sécurité</h4>
                  <ul class="mt-2 space-y-1 text-gray-600">
                    <li>• Prévention des dangers</li>
                    <li>• Protection des victimes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      modules: [
        {
          _id: new ObjectId(),
          moduleId: "moduleA1",
          nom: "Introduction au secourisme PSE1",
          description: "Ce module couvre les bases du secourisme PSE1.",
          ordre: 1,
          contenu: {
            video: "https://youtu.be/orbkg5JH9C8?si=PQSdmLfxbkEBRUZG",
            cours: `
            <div class="max-w-5xl mx-auto">
  <div class="bg-white shadow-lg rounded-lg px-8 py-12 mb-8">
    <h1 class="text-4xl font-bold mb-6 text-center">Formation aux Premiers Secours Civiques de niveau 1 (PSC1)</h1>
    <h2 class="text-3xl font-semibold mb-4">Module 1 : Introduction aux premiers secours</h2>
Copy<div class="mb-8">
  <h3 class="text-2xl font-semibold mb-2">1.1 Définition et objectifs des premiers secours</h3>
  <p class="text-lg mb-4">Les premiers secours désignent l'ensemble des gestes et mesures d'urgence à mettre en œuvre en cas d'accident, de sinistre ou de malaise. Ils visent à préserver la vie de la victime, prévenir l'aggravation de son état et favoriser son rétablissement, dans l'attente de sa prise en charge par les secours médicalisés.</p>
  <p class="text-lg">La formation PSC1 a pour objectifs de permettre à chaque citoyen :</p>
  <ul class="list-disc list-inside mb-4 text-lg">
    <li>D'acquérir les réflexes et les bons comportements face à une situation d'urgence</li>
    <li>D'apprendre les gestes techniques de premiers secours pour faire face aux détresses vitales</li>
    <li>De savoir protéger et alerter les secours en transmettant les informations nécessaires</li>
    <li>D'être en mesure de secourir une victime en attendant l'arrivée des services de secours</li>
  </ul>
</div>

<div class="mb-8">
  <h3 class="text-2xl font-semibold mb-2">1.2 Cadre juridique de l'intervention du citoyen sauveteur</h3>
  
  <p class="text-lg mb-4">En France, l'article 223-6 du Code pénal impose à chacun une obligation d'assistance à personne en péril. Concrètement, tout citoyen se doit de porter secours à une personne en danger, dans la mesure de ses capacités et sans risque pour lui ou les tiers.</p>
  
  <p class="text-lg mb-4">La non-assistance à personne en danger constitue un délit pénal passible de 5 ans d'emprisonnement et de 75 000 euros d'amende. Il s'agit toutefois d'une obligation de moyens et non de résultat : l'important est d'avoir fait son possible compte tenu des circonstances.</p>
  
  <p class="text-lg mb-4">Pour encourager les citoyens à intervenir, la loi prévoit une immunité pénale et civile au bénéfice du sauveteur :</p>
  
  <ul class="list-disc list-inside mb-4 text-lg">
    <li>Son action bénévole et gratuite ne peut engager sa responsabilité, sauf en cas de faute lourde ou intentionnelle</li>
    <li>Les dommages qu'il pourrait causer sont généralement pris en charge par son assurance responsabilité civile</li>
    <li>Les frais éventuellement engagés à l'occasion du sauvetage (ex : vêtements abîmés) peuvent être remboursés par l'État</li>  
  </ul>
  
  <p class="text-lg">En résumé, n'ayez pas peur d'agir, de "mal faire" et d'être poursuivi. Ce qui compte, c'est d'intervenir de bonne foi, avec les moyens dont on dispose sur le moment.</p>
</div>

<div class="mb-8">
  <h3 class="text-2xl font-semibold mb-2">1.3 La chaîne des secours : conduite à tenir pour le sauveteur</h3>
  
  <p class="text-lg mb-4">Face à un accident, un malaise ou une situation périlleuse, il est essentiel de respecter la chronologie des étapes de l'action de secours, appelée "chaîne des secours". Elle comporte 4 maillons indissociables à réaliser dans l'ordre :</p>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="bg-blue-50 rounded p-4">
      <p class="text-lg font-semibold mb-2">1. Protéger</p>
      <p class="text-lg">Avant toute intervention, assurez votre propre sécurité et celle de la victime. Balisez la zone, supprimez les dangers ou soustraire la victime à ceux-ci.</p>
    </div>
    
    <div class="bg-blue-50 rounded p-4">  
      <p class="text-lg font-semibold mb-2">2. Examiner</p>
      <p class="text-lg">Vérifiez l'état de la victime. Recherchez une détresse vitale apparente (inconscience, arrêt respiratoire, saignement abondant...). Ces informations seront précieuses pour les secours.</p>  
    </div>
    
    <div class="bg-blue-50 rounded p-4">
      <p class="text-lg font-semibold mb-2">3. Alerter (ou Faire Alerter)</p>  
      <p class="text-lg">Contactez ou faites contacter rapidement les secours appropriés (15, 18 ou 112). Transmettez un bilan précis de la situation et suivez leurs conseils en attendant leur arrivée.</p>
    </div>
    
    <div class="bg-blue-50 rounded p-4">
      <p class="text-lg font-semibold mb-2">4. Secourir</p>
      <p class="text-lg">Prodiguez à la victime les gestes de premiers secours appropriés à son état. Assistez-la et surveillez l'évolution de son état jusqu'à la prise en charge par les services de secours.</p>  
    </div>
  </div>
  
  <p class="text-lg mt-4">N'hésitez pas à vous faire aider et à répartir les tâches si d'autres témoins sont présents. Mais respectez toujours l'ordre des 4 étapes. Chaque minute gagnée améliore les chances de survie de la victime.</p>  
</div>

<div class="mb-8">
  <h3 class="text-2xl font-semibold mb-2">1.4 Prévenir les risques et agir en toute sécurité</h3>
  
  <p class="text-lg mb-4">Avant d'aborder les gestes techniques de secourisme, il est primordial de rappeler quelques principes généraux pour intervenir efficacement et sans danger :</p>
  
  <ul class="list-disc list-inside text-lg">
    <li class="mb-2">Évaluez la situation dans son ensemble. Assurez-vous de pouvoir agir sans vous mettre en péril ni aggraver le sort de la victime.</li>
    <li class="mb-2">Si la zone reste dangereuse (incendie, accident de la route...), mettez-vous et la victime à l'abri ou attendez en sécurité les secours spécialisés.</li>  
    <li class="mb-2">Méfiez-vous des sur-accidents (chute d'un objet instable, explosion...). Balisez et sécurisez les lieux si nécessaire.</li>
    <li class="mb-2">En présence d'un danger vital immédiat (noyade, électrocution, ensevelissement...), agissez immédiatement mais toujours sans prendre de risques inconsidérés.</li>
    <li class="mb-6">Portez des gants jetables (risque infectieux) et respectez les règles d'hygiène de base (lavage des mains, matériel à usage unique...)</li>
  </ul>
  
  <p class="text-lg">Gardez votre calme, inspirez la confiance à la victime par vos paroles et votre attitude. Restez à son écoute et prodiguez-lui un soutien moral jusqu'à l'arrivée des secours.</p>
</div>

<div class="mb-8">
  <h3 class="text-2xl font-semibold mb-2">1.5 Conclusion du module</h3>
  
  <p class="text-lg">Ce premier module nous a permis de poser les fondements de l'action du citoyen sauveteur :</p>
  
  <ul class="list-disc list-inside text-lg">    
    <li class="mb-2">Les gestes de premiers secours visent à préserver la vie, prévenir l'aggravation et favoriser le rétablissement d'une victime.</li>
    <li class="mb-2">Tout citoyen a le devoir légal de porter assistance, sans risque pour lui. Son action désintéressée est protégée juridiquement.</li>
    <li class="mb-2">Face à un accident, respecter la chaîne des secours : Protéger, Examiner, Alerter, Secourir.</li> 
    <li>Intervenir en toute sécurité est le préalable indispensable à toute action de secours.</li>
  </ul>
  

            `,
            quiz: [
              {
                _id: new ObjectId(),
                question:
                  "Quel est le premier maillon de la chaîne des secours ?",
                options: ["Alerter", "Protéger", "Secourir", "Transporter"],
                answer: "Protéger",
              },
            ],
          },
        },
        {
          _id: new ObjectId(),
          moduleId: "moduleA2",
          nom: "Protection et sécurité",
          description: "Ce module aborde la protection et la sécurité.",
          ordre: 2,
          contenu: {
            video: "https://youtu.be/ZkK5IpAn_m8",
            cours: `
              <div class="max-w-4xl mx-auto space-y-6">
                <div class="bg-white shadow-lg rounded-xl p-6">
                  <h2 class="text-2xl font-bold text-gray-800 mb-6">Protection et Sécurité</h2>
                  
                  <div class="grid md:grid-cols-2 gap-6">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h3 class="text-lg font-semibold text-gray-800 mb-3">
                        <span class="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">1</span>
                        Reconnaissance des dangers
                      </h3>
                      <ul class="space-y-2 text-gray-600">
                        <li class="flex items-start">
                          <span class="text-blue-500 mr-2">•</span>
                          Identification des risques
                        </li>
                        <li class="flex items-start">
                          <span class="text-blue-500 mr-2">•</span>
                          Évaluation de la situation
                        </li>
                      </ul>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4">
                      <h3 class="text-lg font-semibold text-gray-800 mb-3">
                        <span class="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">2</span>
                        Protection et intervention
                      </h3>
                      <ul class="space-y-2 text-gray-600">
                        <li class="flex items-start">
                          <span class="text-blue-500 mr-2">•</span>
                          Équipements de protection
                        </li>
                        <li class="flex items-start">
                          <span class="text-blue-500 mr-2">•</span>
                          Sécurisation de zone
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p class="text-yellow-800 font-medium">Points importants :</p>
                    <ul class="mt-2 space-y-1 text-yellow-700">
                      <li>✓ Toujours évaluer la situation avant d'intervenir</li>
                      <li>✓ Protéger avant d'agir</li>
                      <li>✓ Utiliser les équipements adaptés</li>
                    </ul>
                  </div>
                </div>
              </div>
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
