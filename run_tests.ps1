# E2E Communication Platform - Test Runner PowerShell Script
# This script helps activate the virtual environment and run tests

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "E2E Communication Platform - Test Runner" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
if (-not (Test-Path "admin-prototype.html")) {
    Write-Host "ERROR: admin-prototype.html not found" -ForegroundColor Red
    Write-Host "Please run this script from the HTML prototype directory" -ForegroundColor Red
    exit 1
}

# Check if virtual environment exists
if (-not (Test-Path ".venv")) {
    Write-Host "ERROR: Virtual environment (.venv) not found" -ForegroundColor Red
    Write-Host "Please create a virtual environment first" -ForegroundColor Red
    exit 1
}

Write-Host "Project directory: $PWD" -ForegroundColor Green
Write-Host "Virtual environment: Found" -ForegroundColor Green
Write-Host ""

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
try {
    & ".venv\Scripts\Activate.ps1"
    Write-Host "Virtual environment activated successfully!" -ForegroundColor Green
} catch {
    Write-Host "Failed to activate virtual environment" -ForegroundColor Red
    Write-Host "You may need to set execution policy: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if packages are installed
Write-Host "Checking installed packages..." -ForegroundColor Yellow
$packages = & python -m pip list

if ($packages -match "pytest") {
    Write-Host "✓ pytest found" -ForegroundColor Green
} else {
    Write-Host "✗ pytest not found - installing packages..." -ForegroundColor Yellow
    & python -m pip install -r requirements.txt
}

Write-Host ""

# Show menu options
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Available Test Options:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Verify Setup (Recommended first)" -ForegroundColor White
Write-Host "2. Run Smoke Tests" -ForegroundColor White
Write-Host "3. Run User Management Tests" -ForegroundColor White
Write-Host "4. Run Role Management Tests" -ForegroundColor White
Write-Host "5. Run Settings Tests" -ForegroundColor White
Write-Host "6. Run ALL Tests + Generate Report" -ForegroundColor White
Write-Host "7. Interactive Test Runner (Python)" -ForegroundColor White
Write-Host "8. Exit" -ForegroundColor White
Write-Host ""

do {
    $choice = Read-Host "Select option (1-8)"
    
    switch ($choice) {
        "1" {
            Write-Host "Running setup verification..." -ForegroundColor Yellow
            & python verify_setup.py
        }
        "2" {
            Write-Host "Running smoke tests..." -ForegroundColor Yellow
            & python -m pytest python_tests/test_smoke.py -v
        }
        "3" {
            Write-Host "Running User Management tests..." -ForegroundColor Yellow
            & python -m pytest python_tests/administration/test_user_management.py -v
        }
        "4" {
            Write-Host "Running Role Management tests..." -ForegroundColor Yellow
            & python -m pytest python_tests/administration/test_role_management.py -v
        }
        "5" {
            Write-Host "Running Settings tests..." -ForegroundColor Yellow
            & python -m pytest python_tests/administration/test_settings.py -v
        }
        "6" {
            Write-Host "Running ALL tests with HTML report..." -ForegroundColor Yellow
            & python -m pytest python_tests/ -v --html=test_results/report.html --self-contained-html
            if (Test-Path "test_results/report.html") {
                Write-Host "Report generated: test_results/report.html" -ForegroundColor Green
            }
        }
        "7" {
            Write-Host "Starting interactive test runner..." -ForegroundColor Yellow
            & python run_tests.py
        }
        "8" {
            Write-Host "Goodbye!" -ForegroundColor Green
            exit 0
        }
        default {
            Write-Host "Invalid option. Please select 1-8." -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Press any key to continue or Ctrl+C to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Write-Host ""
    
} while ($choice -ne "8")