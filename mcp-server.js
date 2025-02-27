const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || process.env.MCP_SERVER_PORT || 3000;

// Enable CORS for Cursor editor requests
app.use(cors());

// Basic server health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Your standardized cursor rules
const cursorRules = {
  version: "1.0",
  rules: [
    "Follow business naming conventions for all code",
    "Include proper error handling in all functions",
    "Add JSDoc comments for all public APIs",
    "Use TypeScript for all new code",
    "Follow the project's architectural patterns"
  ],
  context: {
    businessDomain: "Business Central",
    preferredPatterns: ["Repository pattern", "SOLID principles"],
    // Add any other context that would be helpful for AI agents
  }
};

// Endpoint to serve cursor rules as JSON
app.get('/cursorrules', (req, res) => {
  res.json(cursorRules);
});

// NEW: SSE endpoint for Cursor
app.get('/cursorrules-sse', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send the rules as an SSE event
  res.write(`data: ${JSON.stringify(cursorRules)}\n\n`);

  // Keep the connection open but don't send more data
  // Cursor just needs the initial data

  // Handle client disconnect
  req.on('close', () => {
    console.log('SSE connection closed');
    res.end();
  });
});

// Endpoint that can provide additional context based on specific requests
app.get('/context/:contextType', (req, res) => {
  // Handle different types of context requests
  const contextType = req.params.contextType;

  switch (contextType) {
    case 'architecture':
      res.json({ /* Architecture details */ });
      break;
    case 'codestandards':
      res.json({ /* Code standards */ });
      break;
    default:
      res.json({ message: 'Context type not found' });
  }
});

// Azure-specific redirect from root to cursorrules for convenience
app.get('/', (req, res) => {
  res.redirect('/cursorrules');
});

// Log server start
app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Available endpoints:`);
  console.log(`- /cursorrules (GET): Get all cursor rules (JSON)`);
  console.log(`- /cursorrules-sse (GET): Get cursor rules via SSE stream`);
  console.log(`- /context/:contextType (GET): Get specific context`);
  console.log(`- /health (GET): Server health check`);
}); 