
const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    moduleId: { type: String, required: true },
    nom: { type: String, required: true },
    contenu: {
        video: { type: String, required: true },
        cours: { type: String, required: true },
        quiz: [
            {
                question: { type: String, required: true },
                options: [{ type: String, required: true }],
                answer: { type: String, required: true },
            }
        ]
    }
});

const FormationSchema = new mongoose.Schema({
    formationId: { type: String, required: true },
    nom: { type: String, required: true },
    modules: [ModuleSchema],
});

const Formation = mongoose.model('Formation', FormationSchema);
module.exports = Formation;
