#!/bin/bash

# Exit on error
set -e

# Variables - replace these with your values
RESOURCE_GROUP="bc-mcp-group"
LOCATION="westeurope"  # Choose a location close to your team
APP_NAME="bc-mcp-server"
APP_SERVICE_PLAN="bc-mcp-plan"
SKU="B1"  # Basic tier, adjust as needed

# Display banner
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║   BC-MCP Server Azure Deployment                      ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"

# Log in to Azure
echo "Logging in to Azure..."
az login

# Create resource group if it doesn't exist
echo "Creating resource group (if it doesn't exist)..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create App Service Plan
echo "Creating App Service Plan..."
az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP --sku $SKU

# Create Web App
echo "Creating Web App..."
az webapp create --name $APP_NAME --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --runtime "NODE|16-lts"

# Configure environment variables
echo "Configuring environment variables..."
az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP \
  --settings MCP_SERVER_PORT=8080 MCP_SERVER_HOST=0.0.0.0

# Optional: Configure GitHub deployment
read -p "Do you want to set up GitHub deployment? (y/n): " setup_github
if [ "$setup_github" = "y" ] || [ "$setup_github" = "Y" ]; then
  read -p "Enter your GitHub repository URL: " github_repo
  read -p "Enter your GitHub branch (default: main): " github_branch
  github_branch=${github_branch:-main}
  
  echo "Setting up GitHub deployment..."
  az webapp deployment source config --name $APP_NAME --resource-group $RESOURCE_GROUP \
    --repo-url $github_repo --branch $github_branch --manual-integration
fi

# Display deployment information
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║   Deployment Complete!                                ║"
echo "║                                                       ║"
echo "║   Your MCP server is now available at:                ║"
echo "║   https://$APP_NAME.azurewebsites.net                 ║"
echo "║                                                       ║"
echo "║   Connection URL for Cursor:                          ║"
echo "║   https://$APP_NAME.azurewebsites.net/cursorrules     ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝" 