const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

// Schéma des modules
const ModuleSchema = new Schema({
    _id: { type: Types.ObjectId, default: () => new Types.ObjectId() }, // Utilise ObjectId pour les modules
    moduleId: { type: String, required: true }, // Champ conservé pour un identifiant logique si nécessaire
    nom: { type: String, required: true },
    description: { type: String, required: true }, // Nouveau champ description pour le module
    contenu: {
        video: { type: String, required: true },
        cours: { type: String, required: true },
        quiz: [
            {
                _id: { type: Types.ObjectId, default: () => new Types.ObjectId() }, // ObjectId pour chaque question de quiz
                question: { type: String, required: true },
                options: [{ type: String, required: true }],
                answer: { type: String, required: true },
            }
        ]
    }
});

// Schéma des formations
const FormationSchema = new Schema({
    _id: { type: Types.ObjectId, default: () => new Types.ObjectId() }, // Utilise ObjectId pour les formations
    formationId: { type: String, required: true }, // Champ conservé pour un identifiant logique si nécessaire
    nom: { type: String, required: true },
    description: { type: String, required: true }, // Nouveau champ description pour la formation
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],   
    modules: [ModuleSchema],
});

// Modèle de Formation
const Formation = model('Formation', FormationSchema);

module.exports = Formation;
