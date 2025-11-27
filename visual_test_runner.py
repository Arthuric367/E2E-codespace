#!/usr/bin/env python3
"""
Visual Test Runner - Execute this file with Code Runner (Ctrl+F5) for menu-driven testing
No terminal required - uses VS Code output panel
"""

import sys
import subprocess
import os
from pathlib import Path

def print_header():
    print("=" * 60)
    print("E2E Communication Platform - Visual Test Runner")
    print("=" * 60)
    print("🔹 Running from VS Code without terminal access")
    print("🔹 Results will appear in the OUTPUT panel below")
    print("")

def print_menu():
    print("📋 Available Test Options:")
    print("-" * 40)
    print("1️⃣  Verify Setup (Quick Check)")
    print("2️⃣  Run Smoke Tests") 
    print("3️⃣  Run User Management Tests (EP-3, EP-23-29)")
    print("4️⃣  Run Role Management Tests (EP-30-32, EP-40-41, EP-89)")
    print("5️⃣  Run Settings Tests (EP-33-39, EP-44, EP-90, EP-101, EP-110-112)")
    print("6️⃣  Run All Tests")
    print("7️⃣  Generate HTML Report")
    print("")

def run_command(command, description):
    """Run a command and display results"""
    print(f"🚀 {description}")
    print("=" * 50)
    
    try:
        # Use the virtual environment Python
        venv_python = Path(".venv/Scripts/python.exe")
        if venv_python.exists():
            if command.startswith("python "):
                command = command.replace("python ", str(venv_python) + " ", 1)
            elif command.startswith("pytest "):
                command = command.replace("pytest ", str(venv_python) + " -m pytest ", 1)
        
        print(f"💻 Executing: {command}")
        print("")
        
        result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd=".")
        
        if result.stdout:
            print("📤 OUTPUT:")
            print(result.stdout)
            
        if result.stderr and result.returncode != 0:
            print("⚠️  ERRORS:")
            print(result.stderr)
            
        if result.returncode == 0:
            print(f"✅ {description} completed successfully!")
        else:
            print(f"❌ {description} failed (exit code: {result.returncode})")
            
        print("")
        print("=" * 50)
        
    except Exception as e:
        print(f"❌ Error running command: {e}")
    
    return result.returncode == 0

def main():
    """Main function - modify the option number below to run different tests"""
    print_header()
    print_menu()
    
    # 🔧 CONFIGURATION: Change this number to select which test to run
    # When you run this file with Ctrl+F5, it will execute the selected option
    SELECTED_OPTION = 1  # 👈 CHANGE THIS NUMBER (1-7) TO SELECT DIFFERENT TESTS
    
    print(f"🎯 Running Option {SELECTED_OPTION}")
    print("")
    
    # Test commands mapping
    commands = {
        1: ("python verify_setup.py", "Setup Verification"),
        2: ("pytest python_tests/test_smoke.py -v", "Smoke Tests"),
        3: ("pytest python_tests/administration/test_user_management.py -v", "User Management Tests"),
        4: ("pytest python_tests/administration/test_role_management.py -v", "Role Management Tests"),
        5: ("pytest python_tests/administration/test_settings.py -v", "Settings Tests"),
        6: ("pytest python_tests/ -v", "All Tests"),
        7: ("pytest python_tests/ -v --html=test_results/report.html --self-contained-html", "All Tests + HTML Report")
    }
    
    if SELECTED_OPTION in commands:
        command, description = commands[SELECTED_OPTION]
        success = run_command(command, description)
        
        if SELECTED_OPTION == 7 and success:
            report_path = Path("test_results/report.html")
            if report_path.exists():
                print(f"📊 HTML Report generated: {report_path.absolute()}")
                print("   Open this file in your web browser to view detailed results")
    else:
        print(f"❌ Invalid option: {SELECTED_OPTION}")
        print("   Please modify SELECTED_OPTION to a number between 1-7")
    
    print("")
    print("💡 INSTRUCTIONS:")
    print("   1. Modify SELECTED_OPTION in this file to choose different tests")
    print("   2. Save the file (Ctrl+S)")
    print("   3. Run again with Ctrl+F5")
    print("   4. Check OUTPUT panel below for results")
    print("")
    print("🔗 For GUI testing, use VS Code Test Explorer:")
    print("   - Click the Testing icon (🧪) in the left sidebar")
    print("   - Or press Ctrl+Shift+P → 'Python: Configure Tests'")

if __name__ == "__main__":
    main()