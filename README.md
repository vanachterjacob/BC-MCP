# BC-MCP (Business Central Modeling Collaboration Platform)

A centralized server for Business Central AL development editor rules and configurations.

## Purpose

BC-MCP provides a centralized way to manage and distribute cursor editor rules and configurations for Business Central AL development. This helps teams maintain consistent coding practices across projects and developers.

## Features

- Centralized storage for editor configurations and rules
- Version control for configuration settings
- API for retrieving and updating rules
- Integration with Visual Studio Code and AL Language extension
- Support for custom rule sets per project/team

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn 
- Access to Business Central environments (for testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/BC-MCP.git

# Navigate to the project directory
cd BC-MCP

# Install dependencies
npm install

# Start the server
npm start
```

### Configuration

Configuration files are located in the `config` directory. Modify `config.json` to suit your environment.

## Usage

### API Endpoints

- `GET /api/rules` - Retrieve all rules
- `GET /api/rules/:ruleId` - Retrieve a specific rule
- `POST /api/rules` - Create a new rule
- `PUT /api/rules/:ruleId` - Update an existing rule
- `DELETE /api/rules/:ruleId` - Delete a rule

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# Business Central MCP Server for Cursor

This server standardizes AI assistance in Cursor editor by providing consistent context and rules.

## For Server Administrators

1. Clone this repository
2. Run `node install.js` to set up the server
3. Run `npm start` to start the MCP server
4. Ensure the server is accessible to all team members (consider deploying to an internal server)

## For Developers

To connect your Cursor editor to our Business Central standards:

1. Open Cursor editor
2. Go to Settings > AI Configuration > External Context
3. Add a new connection with URL: `http://mcp-server-url:3000/cursorrules`
4. Name it "Business Central Standards"
5. Click "Connect" and verify the connection is successful

Now your AI assistants will have the standardized context for all our business logic and coding standards.

## Troubleshooting

If you encounter issues connecting to the server:
1. Ensure you can reach the server URL in your browser
2. Check that your network allows connections to the server port
3. Contact the admin team if problems persist
