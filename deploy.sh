#!/bin/bash

# CalmateVibes Deployment Script for Netlify
echo "🚀 Preparing CalmateVibes for Netlify deployment..."

# Check if we're in the right directory
if [ ! -f "netlify.toml" ]; then
    echo "❌ Error: netlify.toml not found. Please run this script from the project root."
    exit 1
fi

# Navigate to frontend directory
cd calmatevibes/frontend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in frontend directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building React application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "🌐 Ready for Netlify deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://app.netlify.com"
    echo "2. Connect your GitHub repository"
    echo "3. Set build settings:"
    echo "   - Base directory: calmatevibes/frontend"
    echo "   - Build command: npm run build"
    echo "   - Publish directory: calmatevibes/frontend/build"
    echo ""
    echo "Or use Netlify CLI:"
    echo "   npm install -g netlify-cli"
    echo "   netlify deploy --prod"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi