const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'contributor'],
        default: 'user'
    },
    organization: {
        type: String,
        trim: true
    },
    preferences: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Add an index for faster queries
userSchema.index({ username: 1, email: 1 });

// Method to compare passwords (for login)
userSchema.methods.comparePassword = function (candidatePassword) {
    // In a real implementation, this would use bcrypt.compare
    return candidatePassword === this.password;
};

// Pre-save hook to hash password
userSchema.pre('save', function (next) {
    const user = this;

    // Only hash the password if it's new or modified
    if (!user.isModified('password')) {
        return next();
    }

    // In a real implementation, this would hash the password with bcrypt
    // For demonstration purposes, we're just passing it through
    next();
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User; 