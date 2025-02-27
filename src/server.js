const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const rulesRoutes = require('./routes/rules');
const usersRoutes = require('./routes/users');

// Import middleware
const auth = require('./middleware/auth');

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all routes
app.use(morgan('combined')); // Logging
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Public routes
app.use('/api/users/login', usersRoutes); // Login endpoint doesn't need auth

// Routes that require authentication
app.use('/api/rules', auth.authenticate, rulesRoutes);
app.use('/api/users', auth.authenticate, usersRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Business Central MCP API',
        version: '1.0.0',
        documentation: '/api/docs'
    });
});

// Documentation endpoint
app.get('/api/docs', (req, res) => {
    res.json({
        description: 'API documentation for BC-MCP',
        endpoints: {
            authentication: {
                login: 'POST /api/users/login - Login with username and password',
                register: 'POST /api/users - Register a new user'
            },
            rules: {
                get: 'GET /api/rules - Get all rules',
                getById: 'GET /api/rules/:id - Get rule by ID',
                post: 'POST /api/rules - Create a new rule',
                put: 'PUT /api/rules/:id - Update a rule',
                delete: 'DELETE /api/rules/:id - Delete a rule'
            },
            users: {
                get: 'GET /api/users - Get all users',
                getById: 'GET /api/users/:id - Get user by ID',
                post: 'POST /api/users - Create a new user',
                put: 'PUT /api/users/:id - Update a user',
                delete: 'DELETE /api/users/:id - Delete a user'
            }
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `The requested resource '${req.originalUrl}' was not found on this server`
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`BC-MCP server running on port ${PORT}`);
});

module.exports = app; // Export for testing 