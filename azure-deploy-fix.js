/**
 * Enhanced Azure deployment helper with better error handling
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Preparing Business Central MCP server for Azure deployment...');

// Create enhanced web.config file
const webConfig = `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <webSocket enabled="false" />
    <handlers>
      <add name="iisnode" path="mcp-server.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^mcp-server.js\\/debug[\\/]?" />
        </rule>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}"/>
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="mcp-server.js"/>
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin"/>
        </hiddenSegments>
      </requestFiltering>
    </security>
    <httpErrors existingResponse="PassThrough" />
    <!-- Add iisnode specific settings -->
    <iisnode 
      nodeProcessCommandLine="node"
      loggingEnabled="true"
      logDirectory="iisnode"
      watchedFiles="*.js;node_modules\*;*.json"
      node_env="%node_env%"
     />
  </system.webServer>
  <!-- Fix for environment variables -->
  <system.webServer>
    <httpProtocol>
      <customHeaders>
        <remove name="X-Powered-By"/>
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>`;

fs.writeFileSync(path.join(__dirname, 'web.config'), webConfig);
console.log('✅ Created enhanced web.config for Azure App Service');

// Create improved deploy.sh script
const deployScript = `#!/bin/bash

# ----------------------
# Enhanced Azure Deployment Script
# ----------------------

# Print current directory and files for debugging
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

# Install dependencies with detailed logging
echo "Installing dependencies..."
npm install --production --loglevel verbose || { echo "npm install failed"; exit 1; }

# Create necessary directories
mkdir -p ./public
mkdir -p ./logs
mkdir -p ./iisnode

# Ensure file permissions are correct
chmod 755 ./mcp-server.js
chmod -R 755 ./public

# Verify Node.js version
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"

echo "Deployment script completed successfully"`;

fs.writeFileSync(path.join(__dirname, 'deploy.sh'), deployScript);
execSync('chmod +x deploy.sh', { stdio: 'inherit' });
console.log('✅ Created and made enhanced deploy.sh executable');

// Update package.json for Azure
try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json'));

    // Ensure engines is specified for Node.js version 
    packageJson.engines = packageJson.engines || {};
    packageJson.engines.node = packageJson.engines.node || ">=14.0.0";

    // Add important Azure-specific scripts
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.start = "node mcp-server.js";
    packageJson.scripts["azure-postdeploy"] = "echo Deployment to Azure completed successfully";

    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json with Azure-optimized configuration');
} catch (error) {
    console.error('Error updating package.json:', error);
}

// Create .env.example if it doesn't exist
if (!fs.existsSync('./.env.example')) {
    const envExample = `# Business Central MCP Server Configuration
MCP_SERVER_PORT=8080
MCP_SERVER_HOST=0.0.0.0
JWT_SECRET=your_jwt_secret_key_here
`;
    fs.writeFileSync('./.env.example', envExample);
    console.log('✅ Created .env.example file for reference');
}

console.log('\n✅ Enhanced preparation for Azure deployment completed!'); 