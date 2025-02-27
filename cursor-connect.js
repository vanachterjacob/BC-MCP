/**
 * Script for connecting Cursor editor to the Business Central MCP server (hosted version)
 * Share this with your team to standardize the connection process
 */

const CURSOR_CONFIG = {
  // Update this URL based on your chosen hosting platform
  mcpServer: 'https://bc-mcp-server.onrender.com',  // or other hosting URL
  connectionName: 'Business Central Standards',
  autoConnect: true
};

// This function would be executed within Cursor's environment
function connectToCentralMCP() {
  console.log('Connecting to Business Central MCP server...');
  
  // Fetch the rules from the server
  fetch(`${CURSOR_CONFIG.mcpServer}/cursorrules`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(rules => {
      console.log('Successfully loaded cursor rules:', rules);
      // Apply the rules to Cursor (pseudocode, actual implementation depends on Cursor API)
      // cursor.applyRules(rules);
    })
    .catch(error => {
      console.error('Failed to connect to MCP server:', error);
      // Fallback to local rules if server is unavailable
      console.log('Using fallback local rules');
      return getFallbackRules();
    });
}

// Fallback to local rules if server is unavailable
function getFallbackRules() {
  return {
    version: "1.0",
    rules: [
      "Follow business naming conventions for all code",
      "Include proper error handling in all functions",
      "Add JSDoc comments for all public APIs",
      "Use TypeScript for all new code",
      "Follow the project's architectural patterns"
    ],
    context: {
      businessDomain: "Business Central",
      preferredPatterns: ["Repository pattern", "SOLID principles"]
    }
  };
}

// Export for use in Cursor
module.exports = {
  connectToCentralMCP,
  CURSOR_CONFIG
}; 