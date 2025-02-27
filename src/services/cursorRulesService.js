/**
 * Cursor Rules Service
 * 
 * This service manages the cursor editor rules for AL development.
 * It provides functions to get, validate, transform, and apply rules.
 */

const defaultRules = require('../config/defaultRules');

/**
 * Get a specific set of cursor rules based on type
 * @param {string} type - The type of rules to get (cursor, analyzer, formatter)
 * @returns {Object} The requested rules
 */
exports.getRulesByType = (type) => {
    switch (type) {
        case 'cursor':
            return defaultRules.cursorBehavior;
        case 'analyzer':
            return defaultRules.codeAnalysis;
        case 'formatter':
            return defaultRules.formatting;
        default:
            return null;
    }
};

/**
 * Convert rules to .cursorrules format
 * @param {Object} rules - The rules to convert
 * @returns {Object} Rules in .cursorrules format
 */
exports.toCursorRulesFormat = (rules) => {
    // Start with an empty cursor rules object
    const cursorRules = {
        version: "1.0",
        rules: {}
    };

    // Transform based on rule type
    if (rules.type === 'cursor') {
        // Map cursor behavior rules
        const content = rules.content;

        // Map autocompletion settings
        if (content.autoCompletion) {
            cursorRules.rules.autocompletion = {
                enabled: content.autoCompletion.enabled,
                suggest: {
                    variables: content.autoCompletion.suggestVariables,
                    fields: content.autoCompletion.suggestFields,
                    functions: content.autoCompletion.suggestFunctions,
                    keywords: content.autoCompletion.suggestKeywords
                },
                triggerCharacters: content.autoCompletion.triggerCharacters
            };
        }

        // Map code actions
        if (content.codeActions) {
            cursorRules.rules.codeActions = {
                enabled: true,
                actions: Object.keys(content.codeActions)
                    .filter(key => content.codeActions[key])
                    .map(key => ({ name: key, enabled: true }))
            };
        }

        // Map snippets
        if (content.snippets && content.snippets.enabled) {
            cursorRules.rules.snippets = {
                enabled: content.snippets.enabled,
                items: Object.entries(content.snippets.triggers).map(([trigger, body]) => ({
                    name: trigger,
                    body: body
                }))
            };
        }
    } else if (rules.type === 'formatter') {
        // Map formatting rules
        const content = rules.content;

        cursorRules.rules.formatting = {
            indent: {
                size: content.indentation.size,
                useSpaces: content.indentation.useSpaces
            },
            newLine: {
                beforeOpenBrace: content.braces?.bracesOnNewLine,
                afterCloseBrace: true,
                maxEmpty: content.newLines?.maxEmptyLines || 1
            },
            spacing: {
                aroundOperators: content.spacing?.spaceAroundOperators,
                afterComma: content.spacing?.spaceAfterComma,
                beforeParens: content.spacing?.spaceBeforeParentheses
            }
        };
    } else if (rules.type === 'analyzer') {
        // Map analyzer rules
        const content = rules.content;

        cursorRules.rules.analyzer = {
            enabled: true,
            rules: []
        };

        // Add naming rules
        if (content.naming) {
            cursorRules.rules.analyzer.rules.push({
                id: 'naming',
                enabled: true,
                severity: 'warning',
                options: {
                    variables: content.naming.variableNaming,
                    procedures: content.naming.procedureNaming,
                    tables: content.naming.tableNaming,
                    pages: content.naming.pageNaming
                }
            });
        }

        // Add complexity rules
        if (content.complexity) {
            Object.entries(content.complexity).forEach(([key, value]) => {
                if (value.enabled) {
                    cursorRules.rules.analyzer.rules.push({
                        id: key,
                        enabled: value.enabled,
                        severity: 'warning',
                        options: {
                            ...value
                        }
                    });
                }
            });
        }
    }

    return cursorRules;
};

/**
 * Validate a rule set
 * @param {Object} rules - The rules to validate
 * @returns {Object} Validation result {valid: boolean, errors: string[]}
 */
exports.validateRules = (rules) => {
    const errors = [];

    // Check if rules has required properties
    if (!rules.name) {
        errors.push('Rule set must have a name');
    }

    if (!rules.type) {
        errors.push('Rule set must have a type');
    } else if (!['cursor', 'analyzer', 'formatter', 'linter', 'other'].includes(rules.type)) {
        errors.push('Rule type must be one of: cursor, analyzer, formatter, linter, other');
    }

    if (!rules.content || typeof rules.content !== 'object') {
        errors.push('Rule set must have a content object');
    }

    // Return validation result
    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Merge rule sets
 * @param {Object} baseRules - The base rules
 * @param {Object} overrideRules - The rules to merge in (overriding base rules)
 * @returns {Object} Merged rule set
 */
exports.mergeRules = (baseRules, overrideRules) => {
    if (!baseRules || !overrideRules) {
        return baseRules || overrideRules || {};
    }

    // Create a deep copy of the base rules
    const mergedRules = JSON.parse(JSON.stringify(baseRules));

    // Merge content
    if (overrideRules.content && baseRules.content) {
        mergedRules.content = deepMerge(baseRules.content, overrideRules.content);
    }

    // Override other properties
    mergedRules.name = overrideRules.name || baseRules.name;
    mergedRules.description = overrideRules.description || baseRules.description;
    mergedRules.version = overrideRules.version || baseRules.version;

    return mergedRules;
};

/**
 * Deep merge two objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object to merge in
 * @returns {Object} Merged object
 */
function deepMerge(target, source) {
    const output = { ...target };

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    output[key] = source[key];
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                output[key] = source[key];
            }
        });
    }

    return output;
}

/**
 * Check if value is an object
 * @param {*} item - Value to check
 * @returns {boolean} True if object
 */
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
} 