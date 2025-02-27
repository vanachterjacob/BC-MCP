const jwt = require('jsonwebtoken');

// JWT secret key (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// Middleware to check if the user is authenticated
exports.authenticate = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token is not valid' });
            }

            // Set user from payload
            req.user = decoded;
            next();
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin role required' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Middleware to check if the user is the owner or an admin
exports.isOwnerOrAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Allow if admin or if the user is the owner
        if (req.user.role === 'admin' || req.params.id === req.user.id) {
            return next();
        }

        res.status(403).json({ message: 'Access denied. You are not authorized to perform this action' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}; 