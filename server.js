/**
 * Business Central MCP Server
 * Provides standardized rules and context for Cursor editor
 */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const RuleService = require('./src/services/RuleService');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || process.env.MCP_SERVER_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Cursor rules endpoint (JSON)
app.get('/cursorrules', async (req, res) => {
  try {
    const rules = await RuleService.getCursorRules();
    res.json(rules);
  } catch (error) {
    console.error('Error retrieving rules:', error);
    res.status(500).json({ error: 'Failed to retrieve rules' });
  }
});

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/cursorrules');
});

// Connect to MongoDB (if available)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('No MongoDB URI provided, running with static rules only');
}

// Start server
app.listen(PORT, () => {
  console.log(`BC-MCP Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Available endpoints:`);
  console.log(`- /cursorrules (GET): Get BC rules for Cursor`);
  console.log(`- /health (GET): Server health check`);
}); 