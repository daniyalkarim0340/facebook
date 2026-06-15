import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    toolUsed: {
        type: String,
        default: 'None'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ChatSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true // Optimizes lookup speed as your database grows
    },
    title: {
        type: String,
        default: 'New Thread'
    },
    messages: [MessageSchema]
}, {
    timestamps: true
});

export const ChatSession = mongoose.model('ChatSession', ChatSessionSchema);