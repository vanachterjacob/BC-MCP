const Rule = require('../models/Rule');

// In-memory store until database is set up
let rules = [
    {
        id: '1',
        name: 'AL Formatting Rules',
        description: 'Standard formatting rules for AL code',
        type: 'cursor',
        content: {
            indentation: {
                size: 4,
                useSpaces: true
            },
            alignment: {
                alignVariableDeclarations: true,
                alignAssignments: true,
                alignComments: true
            },
            newLine: {
                beforeOpenBrace: true,
                afterCloseBrace: true,
                maxEmptyLines: 1
            },
            casing: {
                keywords: 'lowercase',
                identifiers: 'PascalCase',
                variables: 'camelCase'
            }
        },
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '2',
        name: 'AL Code Analysis',
        description: 'Code analysis rules for AL development',
        type: 'analyzer',
        content: {
            naming: {
                useDescriptiveNames: true,
                minVariableNameLength: 3,
                forbiddenPrefixes: ['tmp', 'temp']
            },
            complexity: {
                maxMethodLength: 100,
                maxNestedBlocks: 3,
                maxParameters: 5
            },
            patterns: {
                requireRegions: true,
                enforceExceptionHandling: true,
                enforceComments: true
            }
        },
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Get all rules
exports.getAllRules = async (req, res) => {
    try {
        // Filter by query parameters if provided
        const { type, name } = req.query;
        let filteredRules = [...rules];

        if (type) {
            filteredRules = filteredRules.filter(rule => rule.type === type);
        }

        if (name) {
            filteredRules = filteredRules.filter(rule =>
                rule.name.toLowerCase().includes(name.toLowerCase())
            );
        }

        res.json(filteredRules);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get rule by ID
exports.getRuleById = async (req, res) => {
    try {
        const rule = rules.find(r => r.id === req.params.id);

        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }

        res.json(rule);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new rule
exports.createRule = async (req, res) => {
    try {
        const { name, description, type, content } = req.body;

        // Validation
        if (!name || !type || !content) {
            return res.status(400).json({ message: 'Please provide name, type, and content for the rule' });
        }

        const newRule = {
            id: (rules.length + 1).toString(),
            name,
            description: description || '',
            type,
            content,
            version: '1.0.0',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        rules.push(newRule);
        res.status(201).json(newRule);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a rule
exports.updateRule = async (req, res) => {
    try {
        const { name, description, type, content } = req.body;
        const ruleIndex = rules.findIndex(r => r.id === req.params.id);

        if (ruleIndex === -1) {
            return res.status(404).json({ message: 'Rule not found' });
        }

        // Update fields if provided
        if (name) rules[ruleIndex].name = name;
        if (description) rules[ruleIndex].description = description;
        if (type) rules[ruleIndex].type = type;
        if (content) rules[ruleIndex].content = content;

        // Update version and timestamp
        rules[ruleIndex].version = incrementVersion(rules[ruleIndex].version);
        rules[ruleIndex].updatedAt = new Date().toISOString();

        res.json(rules[ruleIndex]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a rule
exports.deleteRule = async (req, res) => {
    try {
        const ruleIndex = rules.findIndex(r => r.id === req.params.id);

        if (ruleIndex === -1) {
            return res.status(404).json({ message: 'Rule not found' });
        }

        const deletedRule = rules.splice(ruleIndex, 1)[0];
        res.json({ message: 'Rule deleted successfully', rule: deletedRule });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Helper function to increment version number
function incrementVersion(version) {
    const parts = version.split('.');
    parts[2] = (parseInt(parts[2]) + 1).toString();
    return parts.join('.');
} 