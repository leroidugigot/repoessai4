const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    ordre: {
        type: Number,
        required: true
    },
    duree: {
        type: Number,  // en minutes
        default: 120
    },
    contenu: {
        cours: {
            type: String,
            required: true
        },
        video: {
            type: String
        },
        quiz: [{
            question: {
                type: String,
                required: true
            },
            options: [{
                type: String,
                required: true
            }],
            reponseCorrecte: {
                type: Number,
                required: true
            }
        }]
    },
    prerequis: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }],
    formation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Formation',
        required: true
    },
    dateCreation: {
        type: Date,
        default: Date.now
    },
    dateMiseAJour: {
        type: Date,
        default: Date.now
    }
});

// Middleware pour mettre à jour la date de modification
moduleSchema.pre('save', function(next) {
    this.dateMiseAJour = Date.now();
    next();
});

// Méthodes du modèle
moduleSchema.statics.findByFormation = function(formationId) {
    return this.find({ formation: formationId }).sort('ordre');
};

moduleSchema.statics.findWithPrerequisCompletes = async function(formationId, progressionUtilisateur) {
    const modules = await this.find({ formation: formationId }).sort('ordre');
    return modules.filter(module => {
        return module.prerequis.every(prerequisId => 
            progressionUtilisateur.some(prog => 
                prog.module.equals(prerequisId) && prog.completed
            )
        );
    });
};

const Module = mongoose.model('Module', moduleSchema);
module.exports = Module;