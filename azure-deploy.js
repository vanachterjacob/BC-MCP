/**
 * Azure deployment helper for Business Central MCP Server
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Preparing Business Central MCP server for Azure deployment...');

// Create web.config file for Azure App Service
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
  </system.webServer>
</configuration>`;

fs.writeFileSync(path.join(__dirname, 'web.config'), webConfig);
console.log('✅ Created web.config for Azure App Service');

// Create .deployment file
const deploymentConfig = `[config]
command = bash ./deploy.sh`;

fs.writeFileSync(path.join(__dirname, '.deployment'), deploymentConfig);
console.log('✅ Created .deployment file');

// Create deploy.sh script
const deployScript = `#!/bin/bash

# ----------------------
# Azure Deployment Script
# ----------------------

# Install dependencies
echo "Installing dependencies..."
npm install --production

# If the 'public' directory doesn't exist, create it
if [ ! -d ./public ]; then
  mkdir -p ./public
  echo "Created public directory"
fi

echo "Deployment script completed successfully"`;

fs.writeFileSync(path.join(__dirname, 'deploy.sh'), deployScript);
execSync('chmod +x deploy.sh', { stdio: 'inherit' });
console.log('✅ Created and made deploy.sh executable');

// Update package.json for Azure
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json'));
  
  // Ensure engines is specified for Node.js version
  packageJson.engines = packageJson.engines || {};
  packageJson.engines.node = packageJson.engines.node || ">=14.0.0";
  
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json with Node.js engine specification');
} catch (error) {
  console.error('Error updating package.json:', error);
}

console.log('\n✅ Preparation for Azure deployment completed!');
console.log('\nNext steps:');
console.log('1. Run: az login');
console.log('2. Run: az webapp up --name YOUR-APP-NAME --resource-group YOUR-RESOURCE-GROUP --plan YOUR-PLAN-NAME --sku B1');
console.log('3. Configure environment variables in Azure Portal or using Azure CLI'); 