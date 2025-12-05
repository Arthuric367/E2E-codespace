"""
Quick Test Environment Check
Run this file to verify pytest installation and test discovery
"""

import sys
import subprocess
from pathlib import Path

def main():
    print("=== E2E Test Environment Diagnostic ===")
    print()
    
    # Check current directory
    current_dir = Path.cwd()
    print(f"Current directory: {current_dir}")
    
    # Check virtual environment
    venv_python = current_dir / ".venv" / "Scripts" / "python.exe"
    venv_pytest = current_dir / ".venv" / "Scripts" / "pytest.exe"
    
    print(f"Virtual environment Python: {venv_python}")
    print(f"Python exists: {venv_python.exists()}")
    print(f"Virtual environment pytest: {venv_pytest}")
    print(f"Pytest exists: {venv_pytest.exists()}")
    print()
    
    # Check Python version and packages
    if venv_python.exists():
        print("=== Checking Python version ===")
        try:
            result = subprocess.run([str(venv_python), "--version"], 
                                  capture_output=True, text=True)
            print(f"Python version: {result.stdout.strip()}")
        except Exception as e:
            print(f"Error checking Python version: {e}")
        
        print("\n=== Checking installed packages ===")
        try:
            result = subprocess.run([str(venv_python), "-m", "pip", "list"], 
                                  capture_output=True, text=True)
            if result.stdout:
                lines = result.stdout.split('\n')
                relevant_packages = [line for line in lines if any(pkg in line.lower() 
                                   for pkg in ['pytest', 'selenium', 'webdriver'])]
                if relevant_packages:
                    for package in relevant_packages:
                        print(f"  {package}")
                else:
                    print("  No pytest, selenium, or webdriver packages found")
                    print("  Full package list:")
                    for line in lines[:10]:  # Show first 10 lines
                        if line.strip():
                            print(f"    {line}")
        except Exception as e:
            print(f"Error checking packages: {e}")
        
        print("\n=== Testing pytest directly ===")
        try:
            result = subprocess.run([str(venv_python), "-c", "import pytest; print(f'pytest version: {pytest.__version__}')"], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                print(f"SUCCESS: {result.stdout.strip()}")
            else:
                print(f"FAILED: {result.stderr.strip()}")
        except Exception as e:
            print(f"Error testing pytest import: {e}")
        
        print("\n=== Testing pytest command ===")
        try:
            result = subprocess.run([str(venv_python), "-m", "pytest", "--version"], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                print(f"SUCCESS: {result.stdout.strip()}")
            else:
                print(f"FAILED: {result.stderr.strip()}")
        except Exception as e:
            print(f"Error running pytest: {e}")
    
    # Check test files
    print("\n=== Checking test files ===")
    test_dir = current_dir / "python_tests"
    if test_dir.exists():
        test_files = list(test_dir.glob("**/*test*.py"))
        print(f"Found {len(test_files)} test files:")
        for test_file in test_files:
            print(f"  {test_file.relative_to(current_dir)}")
    else:
        print(f"Test directory not found: {test_dir}")
    
    print("\n=== Recommendations ===")
    if not venv_python.exists():
        print("❌ Virtual environment not found - need to create one")
    elif not venv_pytest.exists():
        print("❌ pytest not installed - need to install packages")
    else:
        print("✅ Environment looks good - try refreshing VS Code")
        print("   1. Press Ctrl+Shift+P")
        print("   2. Type 'Developer: Reload Window'")
        print("   3. After reload, check Testing panel again")

if __name__ == "__main__":
    main()