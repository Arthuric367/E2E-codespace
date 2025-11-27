"""
Simple test runner for E2E Communication Platform tests
Run this script to execute tests with predefined configurations
"""
import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a command and display results"""
    print(f"\n🚀 {description}")
    print("=" * 60)
    
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd=os.getcwd())
        
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print("⚠️ Warnings/Errors:")
            print(result.stderr)
            
        if result.returncode == 0:
            print(f"✅ {description} completed successfully")
        else:
            print(f"❌ {description} failed with return code {result.returncode}")
            
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error running command: {e}")
        return False

def main():
    """Main test runner function"""
    print("E2E Communication Platform - Python Test Runner")
    print("=" * 60)
    
    # Check if we're in the correct directory
    current_dir = Path.cwd()
    expected_files = ["admin-prototype.html", "pytest.ini", "requirements.txt"]
    
    missing_files = [f for f in expected_files if not (current_dir / f).exists()]
    if missing_files:
        print(f"❌ Missing expected files: {missing_files}")
        print(f"Current directory: {current_dir}")
        print("Please run this script from the HTML prototype directory")
        return
    
    print(f"📁 Working directory: {current_dir}")
    
    # Available test options
    options = {
        "1": {
            "cmd": "pytest python_tests/ -v",
            "desc": "Run All Tests (Verbose)"
        },
        "2": {
            "cmd": "pytest python_tests/administration/test_user_management.py -v",
            "desc": "Run User Management Tests"
        },
        "3": {
            "cmd": "pytest python_tests/administration/test_role_management.py -v", 
            "desc": "Run Role Management Tests"
        },
        "4": {
            "cmd": "pytest python_tests/administration/test_settings.py -v",
            "desc": "Run Settings Tests"
        },
        "5": {
            "cmd": "pytest python_tests/ -m smoke -v",
            "desc": "Run Smoke Tests Only"
        },
        "6": {
            "cmd": "pytest python_tests/ -v --html=test_results/report.html --self-contained-html",
            "desc": "Run All Tests + Generate HTML Report"
        },
        "7": {
            "cmd": "pytest python_tests/ -v -s --maxfail=3",
            "desc": "Run Tests with Debug Output (Stop after 3 failures)"
        },
        "8": {
            "cmd": "pytest --version && python -c \"import selenium; print('Selenium version:', selenium.__version__)\"",
            "desc": "Check Test Environment"
        }
    }
    
    while True:
        print("\n📋 Available Test Options:")
        print("-" * 40)
        for key, option in options.items():
            print(f"{key}. {option['desc']}")
        print("9. Exit")
        
        choice = input("\n👉 Select an option (1-9): ").strip()
        
        if choice == "9":
            print("👋 Goodbye!")
            break
        elif choice in options:
            option = options[choice]
            success = run_command(option["cmd"], option["desc"])
            
            if not success and choice in ["1", "6"]:
                print("\n💡 Tip: If tests fail, try running individual test modules first (options 2-4)")
                print("💡 Check the HTML report in test_results/report.html for detailed failure information")
        else:
            print("❌ Invalid option. Please select 1-9.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚡ Test execution interrupted by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        print("Please check your Python environment and dependencies")