/**
 * Static implementation of Business Central rules for Cursor
 * This can be used if the SSE connection doesn't work reliably
 */
const CURSOR_RULES = {
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
    preferredPatterns: ["Repository pattern", "SOLID principles"],
    coding_standards: {
      naming: "PascalCase for types, camelCase for variables",
      indentation: "4 spaces",
      bracing: "Allman style (braces on new lines)"
    }
  },
  tools: [
    {
      name: "bc_help",
      description: "Get help with Business Central development",
      parameters: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            description: "Topic to get help with"
          }
        },
        required: ["topic"]
      }
    }
  ]
};

// Your team can require() this file directly to get the rules
module.exports = CURSOR_RULES; 