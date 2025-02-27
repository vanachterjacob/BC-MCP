# Business Central MCP Server

A server that provides standardized development rules and context for Business Central projects, optimized for use with Cursor editor.

## Features

- **Static Rules**: JSON-based rules for Cursor editor
- **Render Deployment**: Easy deployment to Render.com
- **Fallback Mode**: Works without database connection
- **Team-Friendly**: Rules automatically applied to all team members

## Quick Start

### For Team Members

To use the BC standards in your project:

1. Clone this repository or copy the following files to your project:
   - `bc-rules.json`
   - `.cursor-context`

2. Cursor will automatically pick up these rules when editing files in your project.

### For Administrators

To update or manage the rules:

1. Edit `bc-rules.json` directly to update static rules
2. Or use the MongoDB database to store and manage rules dynamically
3. Run `node scripts/generateRules.js` to update the static file from the database

## Deployment

### Using Render (Recommended)

1. Run `./scripts/deployRender.sh` to prepare for deployment
2. Push to GitHub
3. Connect repository to Render.com
4. Set environment variables in Render dashboard:
   - `NODE_ENV`: `production`
   - `MCP_SERVER_PORT`: `10000`
   - `MONGODB_URI`: Your MongoDB connection string (optional)

## Endpoints

- `/cursorrules`: Get the current rules (JSON format)
- `/health`: Server health check

## Rule Structure

Rules are structured as follows:

```json
{
  "version": "1.0",
  "rules": [
    "Follow business naming conventions for all code",
    "Include proper error handling in all functions"
  ],
  "context": {
    "businessDomain": "Business Central",
    "preferredPatterns": ["Repository pattern", "SOLID principles"]
  }
}
```
