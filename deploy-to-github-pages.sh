#!/bin/bash

# Create a static version of the cursor rules
mkdir -p public
cat > public/cursorrules.json << EOF
{
  "version": "1.0",
  "rules": [
    "Follow business naming conventions for all code",
    "Include proper error handling in all functions",
    "Add JSDoc comments for all public APIs",
    "Use TypeScript for all new code",
    "Follow the project's architectural patterns"
  ],
  "context": {
    "businessDomain": "Business Central",
    "preferredPatterns": ["Repository pattern", "SOLID principles"]
  }
}
EOF

# Create GitHub Pages workflow
mkdir -p .github/workflows
cat > .github/workflows/github-pages.yml << EOF
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Build static content
        run: |
          mkdir -p _site
          cp -r public/* _site/
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
EOF

echo "✅ Created GitHub Pages deployment files"
echo "Push these changes to your repository"
echo "Enable GitHub Pages in your repository settings"
echo "Your rules will be available at: https://yourusername.github.io/your-repo/cursorrules.json" 