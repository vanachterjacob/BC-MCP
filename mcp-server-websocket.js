// First, install the ws package: npm install ws
const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Regular HTTP endpoints
app.get('/cursorrules', (req, res) => {
  res.json(cursorRules);
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
  
  // Send server info
  ws.send(JSON.stringify({
    type: "server_info",
    server_info: {
      name: "Business Central MCP Server",
      version: "1.0.0"
    }
  }));
  
  // Send tool definitions
  ws.send(JSON.stringify({
    type: "tool_definitions",
    tool_definitions: [
      {
        name: "bc_help",
        description: "Get help with Business Central development",
        parameters: {
          type: "object",
          properties: {
            topic: {
              type: "string",
              description: "Topic to get help with"
            }
          },
          required: ["topic"]
        }
      }
    ]
  }));
  
  // Handle messages from client
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);
      
      if (data.type === 'tool_call') {
        // Process tool call and send response
        const result = { result: "This is a sample result" };
        ws.send(JSON.stringify({
          type: "tool_call_result",
          id: data.tool_call.id,
          result
        }));
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  // Handle disconnect
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 