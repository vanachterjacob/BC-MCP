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

# Check Azure CLI version
az_version=$(az --version | head -1)
echo "Using Azure CLI: $az_version"

# Check for existing resources to prevent redeployment errors
echo "Checking for existing resources..."
existing_group=$(az group exists --name $RESOURCE_GROUP)

if [ "$existing_group" = "true" ]; then
  echo "Resource group already exists: $RESOURCE_GROUP"
else
  echo "Creating resource group (if it doesn't exist)..."
  az group create --name $RESOURCE_GROUP --location $LOCATION
fi

# Check for existing app service plan
existing_plan=$(az appservice plan list --query "[?name=='$APP_SERVICE_PLAN'].name" -o tsv)
if [ -z "$existing_plan" ]; then
  echo "Creating App Service Plan..."
  az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP --sku $SKU
else
  echo "App Service Plan already exists: $APP_SERVICE_PLAN"
fi

# Check for existing web app
existing_app=$(az webapp list --query "[?name=='$APP_NAME'].name" -o tsv)
if [ -z "$existing_app" ]; then
  echo "Creating Web App..."
  az webapp create --name $APP_NAME --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --runtime "NODE|16-lts"
else
  echo "Web App already exists: $APP_NAME"
fi

# Configure environment variables
echo "Configuring environment variables..."
az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP \
  --settings \
  MCP_SERVER_PORT=8080 \
  MCP_SERVER_HOST=0.0.0.0 \
  WEBSITE_NODE_DEFAULT_VERSION=~16 \
  SCM_DO_BUILD_DURING_DEPLOYMENT=true

# Configure correct startup command
echo "Setting startup command..."
az webapp config set --name $APP_NAME --resource-group $RESOURCE_GROUP --startup-file "node mcp-server.js"

# Enable logging
echo "Enabling detailed logging..."
az webapp log config --name $APP_NAME --resource-group $RESOURCE_GROUP --application-logging filesystem --detailed-error-messages true --failed-request-tracing true --web-server-logging filesystem

# Deploy code using local git or GitHub
read -p "Deploy from (1) GitHub or (2) local zip deployment? (1/2): " deploy_type

if [ "$deploy_type" = "1" ]; then
  read -p "Enter your GitHub repository URL: " github_repo
  read -p "Enter your GitHub branch (default: main): " github_branch
  github_branch=${github_branch:-main}
  
  echo "Setting up GitHub deployment..."
  az webapp deployment source config --name $APP_NAME --resource-group $RESOURCE_GROUP \
    --repo-url $github_repo --branch $github_branch --manual-integration
elif [ "$deploy_type" = "2" ]; then
  echo "Preparing for zip deployment..."
  # Create a zip file of the application
  zip -r deploy.zip ./* -x "node_modules/*" "*.git*"
  
  echo "Deploying code via zip upload..."
  az webapp deployment source config-zip --resource-group $RESOURCE_GROUP --name $APP_NAME --src deploy.zip
  
  # Clean up
  rm deploy.zip
else
  echo "Invalid option. Skipping code deployment."
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
echo "║   View logs: https://$APP_NAME.scm.azurewebsites.net  ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"

# Check if deployment was successful
echo "Checking deployment status..."
sleep 10  # Give Azure some time to process

response=$(curl -s -o /dev/null -w "%{http_code}" https://$APP_NAME.azurewebsites.net)
if [ "$response" = "200" ] || [ "$response" = "302" ]; then
  echo "✅ Deployment verified successfully (HTTP Status: $response)"
else
  echo "⚠️ Deployment might have issues (HTTP Status: $response)"
  echo "Check logs at: https://$APP_NAME.scm.azurewebsites.net/api/logs/docker"
fi 