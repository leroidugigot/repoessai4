// models/room.model.js
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'message-circle' // icône par défaut
    },
    type: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    moderators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['member', 'moderator', 'admin'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    settings: {
        maxUsers: {
            type: Number,
            default: 100
        },
        allowReactions: {
            type: Boolean,
            default: true
        },
        allowPinnedMessages: {
            type: Boolean,
            default: true
        },
        allowFileSharing: {
            type: Boolean,
            default: true
        },
        messageRetentionDays: {
            type: Number,
            default: 30
        }
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index pour la recherche
roomSchema.index({ name: 'text', description: 'text' });

// Middleware pre-save pour générer le slug
roomSchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = this.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Méthodes statiques
roomSchema.statics.getDefaultRooms = function() {
    return this.find({ isDefault: true });
};

roomSchema.statics.createDefaultRoom = async function(roomData) {
    const room = new this({
        ...roomData,
        isDefault: true
    });
    return await room.save();
};

// Méthodes d'instance
roomSchema.methods.addMember = async function(userId, role = 'member') {
    if (!this.members.some(member => member.user.equals(userId))) {
        this.members.push({
            user: userId,
            role,
            joinedAt: new Date()
        });
        this.lastActivity = new Date();
        await this.save();
    }
};

roomSchema.methods.removeMember = async function(userId) {
    this.members = this.members.filter(member => !member.user.equals(userId));
    await this.save();
};

roomSchema.methods.isMember = function(userId) {
    return this.members.some(member => member.user.equals(userId));
};

roomSchema.methods.getMemberRole = function(userId) {
    const member = this.members.find(member => member.user.equals(userId));
    return member ? member.role : null;
};

roomSchema.methods.updateLastActivity = async function() {
    this.lastActivity = new Date();
    await this.save();
};

// Création des salles par défaut
async function createDefaultRooms() {
    const defaultRooms = [
        {
            name: 'Général',
            slug: 'general',
            description: 'Salle de discussion générale',
            icon: 'users'
        },
        {
            name: 'Formation',
            slug: 'formation',
            description: 'Discussions sur les formations et cours',
            icon: 'graduation-cap'
        },
        {
            name: 'Entraide',
            slug: 'entraide',
            description: 'Demandez et offrez de l\'aide',
            icon: 'hands-helping'
        },
        {
            name: 'Détente',
            slug: 'detente',
            description: 'Discussions informelles et détente',
            icon: 'coffee'
        },
        {
            name: 'Ressources',
            slug: 'ressources',
            description: 'Partage de ressources et documentation',
            icon: 'book'
        },
        {
            name: 'Événements',
            slug: 'evenements',
            description: 'Annonces et discussions d\'événements',
            icon: 'calendar'
        }
    ];

    for (const room of defaultRooms) {
        try {
            await mongoose.model('Room').findOneAndUpdate(
                { slug: room.slug },
                { 
                    ...room,
                    isDefault: true,
                    type: 'public'
                },
                { upsert: true, new: true }
            );
        } catch (error) {
            console.error(`Erreur lors de la création de la salle ${room.name}:`, error);
        }
    }
}

// Export du modèle
const Room = mongoose.model('Room', roomSchema);

// Créer les salles par défaut lors de l'initialisation
Room.getDefaultRooms().then(rooms => {
    if (rooms.length === 0) {
        createDefaultRooms();
    }
});

module.exports = Room;