#!/bin/bash

# Create render.yaml configuration file
cat > render.yaml << EOF
services:
  - type: web
    name: bc-mcp-server
    env: node
    buildCommand: npm install
    startCommand: node mcp-server.js
    envVars:
      - key: MCP_SERVER_PORT
        value: 10000
      - key: MCP_SERVER_HOST
        value: 0.0.0.0
EOF

echo "✅ render.yaml created!"
echo "Now follow these steps:"
echo "1. Create a free account at https://render.com"
echo "2. Create a new GitHub repository and push your code"
echo "3. In Render dashboard, click 'New' and select 'Blueprint'"
echo "4. Connect your GitHub repository"
echo "5. Render will detect your render.yaml and deploy the service" 