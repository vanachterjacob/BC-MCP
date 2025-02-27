const mongoose = require('mongoose');

// Define the Rule schema
const ruleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['cursor', 'analyzer', 'formatter', 'linter', 'other'],
        default: 'cursor'
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    version: {
        type: String,
        required: true,
        default: '1.0.0'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Add an index for faster queries
ruleSchema.index({ name: 1, type: 1 });

// Create a virtual property for formatted timestamps
ruleSchema.virtual('createdAtFormatted').get(function () {
    return new Date(this.createdAt).toLocaleString();
});

ruleSchema.virtual('updatedAtFormatted').get(function () {
    return new Date(this.updatedAt).toLocaleString();
});

// Create a model from the schema
const Rule = mongoose.model('Rule', ruleSchema);

module.exports = Rule; 