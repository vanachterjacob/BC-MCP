/**
 * Service for managing Business Central rules
 */
const Rule = require('../models/Rule');
const fs = require('fs').promises;
const path = require('path');

class RuleService {
  /**
   * Get rules formatted for Cursor editor
   * Falls back to static rules if database is unavailable
   */
  static async getCursorRules() {
    try {
      // Try to get rules from database
      if (process.env.MONGODB_URI) {
        const rules = await Rule.find({ type: 'cursor' }).lean();
        
        if (rules && rules.length > 0) {
          return this._formatRulesForCursor(rules);
        }
      }
      
      // Fallback to static rules
      return this._getStaticRules();
    } catch (error) {
      console.error('Error retrieving rules:', error);
      // Fallback to static rules on error
      return this._getStaticRules();
    }
  }
  
  /**
   * Format database rules for Cursor
   */
  static _formatRulesForCursor(rules) {
    return {
      version: "1.0",
      rules: rules.map(rule => rule.description || rule.name),
      context: {
        businessDomain: "Business Central",
        preferredPatterns: ["Repository pattern", "SOLID principles"],
        coding_standards: {
          naming: "PascalCase for types, camelCase for variables",
          indentation: "4 spaces",
          bracing: "Allman style (braces on new lines)"
        }
      }
    };
  }
  
  /**
   * Get static rules from bc-rules.json
   */
  static async _getStaticRules() {
    try {
      const rulesPath = path.join(process.cwd(), 'bc-rules.json');
      const rulesData = await fs.readFile(rulesPath, 'utf8');
      const parsedRules = JSON.parse(rulesData);
      
      return parsedRules.businessCentralRules;
    } catch (error) {
      console.error('Error reading static rules:', error);
      
      // Return minimal default rules if all else fails
      return {
        version: "1.0",
        rules: [
          "Follow business naming conventions for all code",
          "Include proper error handling in all functions",
          "Add JSDoc comments for all public APIs"
        ],
        context: {
          businessDomain: "Business Central"
        }
      };
    }
  }
  
  /**
   * Generate static rules file from database
   * Used by scripts to keep bc-rules.json in sync
   */
  static async generateStaticRulesFile() {
    try {
      const rules = await this.getCursorRules();
      const rulesJson = JSON.stringify({ businessCentralRules: rules }, null, 2);
      
      const rulesPath = path.join(process.cwd(), 'bc-rules.json');
      await fs.writeFile(rulesPath, rulesJson);
      
      console.log('Static rules file generated successfully');
      return true;
    } catch (error) {
      console.error('Error generating static rules file:', error);
      return false;
    }
  }
}

module.exports = RuleService; 