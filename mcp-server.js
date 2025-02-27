const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || process.env.MCP_SERVER_PORT || 3000;

// Enable CORS for Cursor editor requests
app.use(cors());

// Basic server health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Your standardized cursor rules
const cursorRules = {
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
    // Add any other context that would be helpful for AI agents
  }
};

// Endpoint to serve cursor rules as JSON
app.get('/cursorrules', (req, res) => {
  res.json(cursorRules);
});

// NEW: MCP-compatible endpoint for Cursor
app.get('/cursorrules-sse', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send server info message
  res.write(`data: ${JSON.stringify({
    type: "server_info",
    server_info: {
      name: "Business Central MCP Server",
      version: "1.0.0"
    }
  })}\n\n`);

  // Send tool definitions - this is the key part Cursor needs
  res.write(`data: ${JSON.stringify({
    type: "tool_definitions",
    tool_definitions: [
      {
        name: "bc_validate_naming",
        description: "Validates if a name follows Business Central naming conventions",
        parameters: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The name to validate"
            },
            type: {
              type: "string",
              enum: ["variable", "function", "class", "table", "page"],
              description: "The type of identifier being validated"
            }
          },
          required: ["name"]
        }
      },
      {
        name: "bc_suggest_pattern",
        description: "Suggests the appropriate Business Central pattern for a use case",
        parameters: {
          type: "object",
          properties: {
            description: {
              type: "string",
              description: "Description of the functionality to implement"
            }
          },
          required: ["description"]
        }
      },
      {
        name: "bc_structure_help",
        description: "Provides guidance on Business Central solution structure",
        parameters: {
          type: "object",
          properties: {
            component: {
              type: "string",
              enum: ["table", "page", "report", "codeunit", "query", "xmlport"],
              description: "The component type to get structure help for"
            }
          },
          required: ["component"]
        }
      }
    ]
  })}\n\n`);

  // Handle tool calls - this would be from Cursor when tools are invoked
  req.on('data', (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === "tool_call") {
        const call = message.tool_call;
        console.log(`Tool call received: ${call.name}`, call.parameters);

        // Process the tool call based on which tool was invoked
        let result;

        switch (call.name) {
          case "bc_validate_naming":
            const name = call.parameters.name;
            const type = call.parameters.type || "variable";

            // Logic to validate name according to Business Central conventions
            const isValid = validateBCNaming(name, type);
            result = {
              is_valid: isValid,
              message: isValid
                ? `The name "${name}" follows Business Central naming conventions for ${type}`
                : `The name "${name}" does not follow Business Central naming conventions for ${type}`
            };
            break;

          case "bc_suggest_pattern":
            const description = call.parameters.description;
            // Logic to suggest a pattern
            result = suggestBCPattern(description);
            break;

          case "bc_structure_help":
            const component = call.parameters.component;
            // Logic to provide structure help
            result = getBCStructureHelp(component);
            break;

          default:
            result = { error: "Unknown tool" };
        }

        // Send the tool call result back to Cursor
        res.write(`data: ${JSON.stringify({
          type: "tool_call_result",
          id: call.id,
          result: result
        })}\n\n`);
      }
    } catch (error) {
      console.error("Error processing tool call:", error);
      res.write(`data: ${JSON.stringify({
        type: "error",
        error: error.message
      })}\n\n`);
    }
  });

  // Handle client disconnect
  req.on('close', () => {
    console.log('SSE connection closed');
    res.end();
  });
});

// Helper functions for processing tool calls
function validateBCNaming(name, type) {
  // Simple validation logic - expand as needed
  switch (type) {
    case "variable":
      return /^[a-z][a-zA-Z0-9]*$/.test(name); // camelCase
    case "function":
      return /^[A-Z][a-zA-Z0-9]*$/.test(name); // PascalCase
    case "class":
      return /^[A-Z][a-zA-Z0-9]*$/.test(name); // PascalCase
    case "table":
      return /^[A-Z][a-zA-Z0-9]*$/.test(name); // PascalCase
    case "page":
      return /^[A-Z][a-zA-Z0-9]*$/.test(name); // PascalCase
    default:
      return false;
  }
}

function suggestBCPattern(description) {
  // Simple pattern suggestion logic
  const lowerDesc = description.toLowerCase();

  if (lowerDesc.includes("data access") || lowerDesc.includes("database")) {
    return {
      pattern: "Repository Pattern",
      explanation: "The Repository pattern is recommended for data access in Business Central, providing a clean separation between business logic and data access logic.",
      example: "```typescript\nclass CustomerRepository {\n  getCustomer(id: string): Customer { ... }\n  saveCustomer(customer: Customer): void { ... }\n}\n```"
    };
  } else if (lowerDesc.includes("api") || lowerDesc.includes("interface")) {
    return {
      pattern: "Facade Pattern",
      explanation: "The Facade pattern provides a simplified interface to a complex subsystem.",
      example: "```typescript\nclass CustomerFacade {\n  constructor(private repo: CustomerRepository, private validation: ValidationService) {}\n  \n  processCustomer(data: any): Result { ... }\n}\n```"
    };
  } else {
    return {
      pattern: "SOLID Principles",
      explanation: "Consider applying SOLID principles to your design, focusing on single responsibility and dependency injection.",
      recommendations: [
        "Separate concerns into distinct classes",
        "Use interfaces for dependency injection",
        "Consider using factory patterns for object creation"
      ]
    };
  }
}

function getBCStructureHelp(component) {
  // Structure guidance based on component type
  const structures = {
    "table": {
      description: "Business Central tables define the data structure",
      bestPractices: [
        "Use PascalCase for table names (e.g., Customer, SalesInvoice)",
        "Include appropriate primary keys",
        "Define relations to other tables",
        "Add proper field descriptions"
      ],
      example: "```al\ntable 50100 CustomerExtension\n{\n  fields\n  {\n    field(1; CustomerID; Code[20])\n    {\n      Caption = 'Customer ID';\n    }\n    // Add more fields\n  }\n}\n```"
    },
    "page": {
      description: "Pages are the UI representation of tables in Business Central",
      bestPractices: [
        "Follow a consistent layout",
        "Group related fields",
        "Implement proper actions",
        "Handle permissions appropriately"
      ],
      example: "```al\npage 50100 CustomerExtensionCard\n{\n  PageType = Card;\n  SourceTable = CustomerExtension;\n  // Define layout and actions\n}\n```"
    },
    // Add more components as needed
  };

  return structures[component] || {
    description: `${component} is a Business Central component type`,
    message: "Detailed structure help is not available for this component type yet."
  };
}

// Endpoint that can provide additional context based on specific requests
app.get('/context/:contextType', (req, res) => {
  // Handle different types of context requests
  const contextType = req.params.contextType;

  switch (contextType) {
    case 'architecture':
      res.json({ /* Architecture details */ });
      break;
    case 'codestandards':
      res.json({ /* Code standards */ });
      break;
    default:
      res.json({ message: 'Context type not found' });
  }
});

// Azure-specific redirect from root to cursorrules for convenience
app.get('/', (req, res) => {
  res.redirect('/cursorrules');
});

// Log server start
app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Available endpoints:`);
  console.log(`- /cursorrules (GET): Get all cursor rules (JSON)`);
  console.log(`- /cursorrules-sse (GET): Get cursor rules via SSE stream`);
  console.log(`- /context/:contextType (GET): Get specific context`);
  console.log(`- /health (GET): Server health check`);
}); 