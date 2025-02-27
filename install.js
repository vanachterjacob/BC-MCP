/**
 * BC-MCP Installation Script
 * 
 * This script helps set up the BC-MCP server by:
 * 1. Creating the .env file from .env.example
 * 2. Installing dependencies
 * 3. Setting up initial configuration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║                                                       ║');
console.log('║   BC-MCP Server Installation                          ║');
console.log('║   Business Central Modeling Collaboration Platform    ║');
console.log('║                                                       ║');
console.log('╚═══════════════════════════════════════════════════════╝');
console.log('');

// Create .env file
const setupEnv = () => {
    console.log('Creating .env file...');

    if (!fs.existsSync('./.env.example')) {
        console.error('Error: .env.example file not found.');
        process.exit(1);
    }

    // Generate a secure JWT secret
    const jwtSecret = crypto.randomBytes(32).toString('hex');

    // Read the example file
    let envExample = fs.readFileSync('./.env.example', 'utf8');

    // Replace the JWT_SECRET with the generated one
    envExample = envExample.replace('JWT_SECRET=your_jwt_secret_key_here', `JWT_SECRET=${jwtSecret}`);

    // Write to .env file
    fs.writeFileSync('./.env', envExample);

    console.log('✅ .env file created successfully with a secure JWT secret.');
};

// Install dependencies
const installDependencies = () => {
    console.log('Installing dependencies...');

    try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('✅ Dependencies installed successfully.');
    } catch (error) {
        console.error('Error installing dependencies:', error.message);
        process.exit(1);
    }
};

// Prepare for Azure deployment
const prepareForAzure = () => {
    console.log('\nPreparing for Azure deployment...');
    try {
        // Call the azure-deploy.js script
        require('./azure-deploy');
    } catch (error) {
        console.error('Error preparing for Azure:', error.message);
        process.exit(1);
    }
};

// Start the installation process
const startInstallation = () => {
    // Ensure all necessary files exist
    const requiredFiles = ['mcp-server.js', 'package.json', 'cursor-connect.js'];
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, file)));

    if (missingFiles.length > 0) {
        console.error(`Missing required files: ${missingFiles.join(', ')}`);
        process.exit(1);
    }

    rl.question('This will set up the BC-MCP server. Do you want to continue? (y/n) ', (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            setupEnv();
            installDependencies();

            rl.question('Do you want to prepare for Azure deployment? (y/n) ', (azureAnswer) => {
                if (azureAnswer.toLowerCase() === 'y' || azureAnswer.toLowerCase() === 'yes') {
                    prepareForAzure();
                }

                console.log('');
                console.log('╔═══════════════════════════════════════════════════════╗');
                console.log('║                                                       ║');
                console.log('║   Installation Complete!                              ║');
                console.log('║                                                       ║');
                console.log('║   To start the server locally:                        ║');
                console.log('║   npm start                                           ║');
                console.log('║                                                       ║');
                console.log('║   The server will run on http://localhost:3000        ║');
                console.log('║                                                       ║');
                if (azureAnswer.toLowerCase() === 'y' || azureAnswer.toLowerCase() === 'yes') {
                    console.log('║   To deploy to Azure:                                 ║');
                    console.log('║   1. az login                                         ║');
                    console.log('║   2. az webapp up --name YOUR-APP-NAME                ║');
                    console.log('║      --resource-group YOUR-RESOURCE-GROUP             ║');
                    console.log('║      --plan YOUR-PLAN-NAME --sku B1                   ║');
                    console.log('║                                                       ║');
                }
                console.log('╚═══════════════════════════════════════════════════════╝');

                rl.close();
            });
        } else {
            console.log('Installation cancelled.');
            rl.close();
        }
    });
};

startInstallation();

/**
 * Installation script for Business Central MCP server
 */
console.log('Setting up Business Central MCP server...');

// Ensure all necessary files exist
const requiredFiles = ['mcp-server.js', 'package.json', 'cursor-connect.js'];
const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, file)));

if (missingFiles.length > 0) {
    console.error(`Missing required files: ${missingFiles.join(', ')}`);
    process.exit(1);
}

// Install dependencies
console.log('Installing dependencies...');
try {
    execSync('npm install', { stdio: 'inherit' });
} catch (error) {
    console.error('Failed to install dependencies:', error);
    process.exit(1);
}

// Create configuration file
const configContent = `
# Business Central MCP Server Configuration
MCP_SERVER_PORT=3000
MCP_SERVER_HOST=0.0.0.0
`;

fs.writeFileSync(path.join(__dirname, '.env'), configContent);

console.log('Installation complete! Run "npm start" to start the MCP server.');
console.log('Share the cursor-connect.js file with your team to connect to the server from Cursor.'); 