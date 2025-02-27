/**
 * Script to generate bc-rules.json from database rules
 * Run with: node scripts/generateRules.js
 */
const mongoose = require('mongoose');
require('../src/models/Rule');
const RuleService = require('../src/services/RuleService');

// MongoDB connection
async function main() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bc-mcp');
    
    // Generate static rules file
    console.log('Generating static rules file...');
    await RuleService.generateStaticRulesFile();
    
    console.log('✅ Rules generated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating rules:', error);
    process.exit(1);
  }
}

// Run the script
main(); 