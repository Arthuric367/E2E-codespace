# Manual Playwright Installation Script

Write-Host "🎯 Manual Playwright Installation Guide" -ForegroundColor Green
Write-Host "======================================="

$downloadsPath = "C:\Users\AC93313\Downloads\playwright-1.56.1.zip\playwright-1.56.1"
$projectPath = "C:\Users\AC93313\OneDrive - CLP\Documents\E2E\E2E Prototype\HTML"

Write-Host ""
Write-Host "📁 Detected Playwright folder: $downloadsPath" -ForegroundColor Yellow

Write-Host ""
Write-Host "🔧 STEP 1: Extract and Copy Files"
Write-Host "1. Navigate to: $downloadsPath"
Write-Host "2. Look for 'packages' or 'node_modules' folder"
Write-Host "3. Find '@playwright' folder inside"

Write-Host ""
Write-Host "🔧 STEP 2: Manual Installation Commands"
Write-Host "Run these commands in PowerShell:"

Write-Host ""
Write-Host "# Navigate to project directory" -ForegroundColor Cyan
Write-Host "cd '$projectPath'"

Write-Host ""
Write-Host "# Create node_modules folder if it doesn't exist" -ForegroundColor Cyan
Write-Host "mkdir node_modules -Force"
Write-Host "mkdir node_modules\@playwright -Force"

Write-Host ""
Write-Host "# Copy Playwright files" -ForegroundColor Cyan
Write-Host "Copy-Item -Path '$downloadsPath\*' -Destination 'node_modules\@playwright\test' -Recurse -Force"

Write-Host ""
Write-Host "🔧 STEP 3: Alternative - Install from TAR file"
Write-Host "If you have a .tgz or .tar.gz file:"
Write-Host "npm install playwright-test-1.56.1.tgz --no-save"

Write-Host ""
Write-Host "🔧 STEP 4: Quick Setup Commands"
Write-Host "Copy and run these commands:"

$commands = @"
# Navigate to project
cd "C:\Users\AC93313\OneDrive - CLP\Documents\E2E\E2E Prototype\HTML"

# Create folder structure
New-Item -ItemType Directory -Force -Path "node_modules\@playwright\test"

# Copy Playwright files (adjust source path if needed)
Copy-Item -Path "C:\Users\AC93313\Downloads\playwright-1.56.1.zip\playwright-1.56.1\*" -Destination "node_modules\@playwright\test" -Recurse -Force

# Verify installation
ls node_modules\@playwright\test

# Try running a test
npx playwright --version
"@

Write-Host $commands -ForegroundColor Green

Write-Host ""
Write-Host "⚠️  TROUBLESHOOTING:" -ForegroundColor Red
Write-Host "If the above doesn't work:"
Write-Host "1. Look inside the downloaded folder for package.json"
Write-Host "2. The structure might be different"
Write-Host "3. Try copying the entire folder to node_modules\playwright"
Write-Host "4. Run: npm link playwright"

Write-Host ""
Write-Host "🎯 VERIFICATION:"
Write-Host "After copying files, run:"
Write-Host "npx playwright --version"
Write-Host ""
Write-Host "If that works, then run:"
Write-Host "npx playwright install msedge"

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")