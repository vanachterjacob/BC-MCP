#!/bin/bash

echo "Preparing BC-MCP Server for Render deployment..."

# Create render.yaml if it doesn't exist
if [ ! -f "render.yaml" ]; then
  cat > render.yaml << EOF
services:
  - type: web
    name: bc-mcp-server
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: MCP_SERVER_PORT
        value: 10000
EOF
  echo "✅ Created render.yaml configuration"
fi

# Generate static rules file for fallback
echo "Generating static rules file..."
node scripts/generateRules.js || {
  echo "⚠️ Could not generate rules from database, using existing static rules"
}

echo "✅ Deployment preparation complete!"
echo ""
echo "To deploy to Render:"
echo "1. Commit and push these changes to GitHub"
echo "2. Connect your repository in Render dashboard"
echo "3. Render will automatically deploy your service" 