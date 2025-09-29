# CalmateVibes Deployment Script for Netlify (PowerShell)
Write-Host "🚀 Preparing CalmateVibes for Netlify deployment..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "netlify.toml")) {
    Write-Host "❌ Error: netlify.toml not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Navigate to frontend directory
Set-Location "calmatevibes\frontend"

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found in frontend directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "🏗️  Building React application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Ready for Netlify deployment!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to https://app.netlify.com"
    Write-Host "2. Connect your GitHub repository"
    Write-Host "3. Set build settings:"
    Write-Host "   - Base directory: calmatevibes/frontend"
    Write-Host "   - Build command: npm run build"
    Write-Host "   - Publish directory: calmatevibes/frontend/build"
    Write-Host ""
    Write-Host "Or use Netlify CLI:" -ForegroundColor Cyan
    Write-Host "   npm install -g netlify-cli"
    Write-Host "   netlify deploy --prod"
} else {
    Write-Host "❌ Build failed. Please check the errors above." -ForegroundColor Red
    exit 1
}