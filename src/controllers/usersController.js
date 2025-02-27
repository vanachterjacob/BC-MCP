const jwt = require('jsonwebtoken');
const User = require('../models/User');

// In-memory store until database is set up
let users = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123', // In a real application, this would be hashed
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '2',
        username: 'user',
        email: 'user@example.com',
        password: 'user123', // In a real application, this would be hashed
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// JWT secret key (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        // Remove sensitive information before sending
        const safeUsers = users.map(({ password, ...rest }) => rest);
        res.json(safeUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = users.find(u => u.id === req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove sensitive information before sending
        const { password, ...safeUser } = user;
        res.json(safeUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Register a new user
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role = 'user' } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide username, email, and password' });
        }

        // Check if username or email already exists
        if (users.some(u => u.username === username)) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        if (users.some(u => u.email === email)) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const newUser = {
            id: (users.length + 1).toString(),
            username,
            email,
            password, // In a real application, this would be hashed
            role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        users.push(newUser);

        // Create JWT token for automatic login
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Remove sensitive information before sending
        const { password: _, ...safeUser } = newUser;

        res.status(201).json({
            message: 'User registered successfully',
            user: safeUser,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        // Find user by username
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password (in a real application, would compare hashed passwords)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Remove sensitive information before sending
        const { password: _, ...safeUser } = user;

        res.json({
            message: 'Login successful',
            user: safeUser,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const userIndex = users.findIndex(u => u.id === req.params.id);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (username) {
            // Check if new username already exists
            if (users.some(u => u.username === username && u.id !== req.params.id)) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            users[userIndex].username = username;
        }

        if (email) {
            // Check if new email already exists
            if (users.some(u => u.email === email && u.id !== req.params.id)) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            users[userIndex].email = email;
        }

        if (password) {
            // In a real application, this would be hashed
            users[userIndex].password = password;
        }

        if (role) {
            users[userIndex].role = role;
        }

        // Update timestamp
        users[userIndex].updatedAt = new Date().toISOString();

        // Remove sensitive information before sending
        const { password: _, ...safeUser } = users[userIndex];

        res.json({
            message: 'User updated successfully',
            user: safeUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const userIndex = users.findIndex(u => u.id === req.params.id);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        const deletedUser = users.splice(userIndex, 1)[0];

        // Remove sensitive information before sending
        const { password: _, ...safeUser } = deletedUser;

        res.json({
            message: 'User deleted successfully',
            user: safeUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}; 