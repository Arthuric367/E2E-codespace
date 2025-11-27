# Manual Playwright Installation - Step by Step
# Run this in PowerShell

Write-Host "🚀 Starting Manual Playwright Installation..." -ForegroundColor Green

# Define paths
$projectPath = "C:\Users\AC93313\OneDrive - CLP\Documents\E2E\E2E Prototype\HTML"
$downloadsPath = "C:\Users\AC93313\Downloads\playwright-1.56.1.zip\playwright-1.56.1"

# Step 1: Navigate to project directory
Write-Host "📁 Step 1: Navigating to project directory..." -ForegroundColor Yellow
Set-Location $projectPath

# Step 2: Create node_modules structure
Write-Host "📁 Step 2: Creating node_modules structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "node_modules" | Out-Null
New-Item -ItemType Directory -Force -Path "node_modules\@playwright" | Out-Null
New-Item -ItemType Directory -Force -Path "node_modules\@playwright\test" | Out-Null

# Step 3: Check if download exists
Write-Host "🔍 Step 3: Checking downloaded files..." -ForegroundColor Yellow
if (Test-Path $downloadsPath) {
    Write-Host "✅ Found Playwright download at: $downloadsPath" -ForegroundColor Green
    
    # List contents to see structure
    Write-Host "📋 Contents of downloaded folder:" -ForegroundColor Cyan
    Get-ChildItem $downloadsPath | Select-Object Name, Mode | Format-Table
    
    # Step 4: Copy files
    Write-Host "📋 Step 4: Copying Playwright files..." -ForegroundColor Yellow
    try {
        Copy-Item -Path "$downloadsPath\*" -Destination "node_modules\@playwright\test" -Recurse -Force
        Write-Host "✅ Files copied successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error copying files: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 Try copying manually or check folder structure" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Download not found at: $downloadsPath" -ForegroundColor Red
    Write-Host "💡 Please check the exact path of your downloaded folder" -ForegroundColor Yellow
}

# Step 5: Create basic package.json for playwright if needed
Write-Host "📋 Step 5: Setting up package files..." -ForegroundColor Yellow

# Create a minimal package.json in the playwright folder if it doesn't exist
$playwrightPackageJson = @"
{
  "name": "@playwright/test",
  "version": "1.56.1",
  "main": "index.js",
  "bin": {
    "playwright": "cli.js"
  }
}
"@

if (-not (Test-Path "node_modules\@playwright\test\package.json")) {
    $playwrightPackageJson | Out-File -FilePath "node_modules\@playwright\test\package.json" -Encoding UTF8
    Write-Host "✅ Created package.json for Playwright" -ForegroundColor Green
}

# Step 6: Verify installation
Write-Host "🔍 Step 6: Verifying installation..." -ForegroundColor Yellow

if (Test-Path "node_modules\@playwright\test") {
    Write-Host "✅ Playwright folder created" -ForegroundColor Green
    
    # Check for key files
    $keyFiles = @("package.json", "index.js", "cli.js", "lib")
    foreach ($file in $keyFiles) {
        if (Test-Path "node_modules\@playwright\test\$file") {
            Write-Host "  ✅ Found: $file" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Missing: $file" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ Playwright folder not created" -ForegroundColor Red
}

# Step 7: Test the installation
Write-Host "🧪 Step 7: Testing installation..." -ForegroundColor Yellow
try {
    $version = & npx playwright --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Playwright working! Version: $version" -ForegroundColor Green
        
        # Try to install browsers
        Write-Host "📥 Installing Microsoft Edge browser..." -ForegroundColor Yellow
        & npx playwright install msedge
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Browser installation completed!" -ForegroundColor Green
            Write-Host "🎉 Ready to run tests!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Browser installation failed, but Playwright is working" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Playwright command failed: $version" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Could not run playwright command: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. If installation worked, run: npm run test:headed"
Write-Host "2. If not working, check the folder structure in your download"
Write-Host "3. You might need to extract the ZIP file properly first"
Write-Host "4. Alternative: Use the manual-test-runner.html for testing"

Write-Host ""
Write-Host "📁 Current project structure:" -ForegroundColor Cyan
if (Test-Path "node_modules") {
    tree node_modules /f
} else {
    Write-Host "No node_modules folder found"
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")