"""
Smoke test to verify the test framework is working
This is a simple test to validate the setup before running full test suite
"""
import pytest
import sys
import os
from pathlib import Path

# Add the parent directory to Python path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_python_environment():
    """Verify Python environment is properly configured"""
    # Check Python version
    assert sys.version_info.major >= 3, "Python 3+ required"
    assert sys.version_info.minor >= 7, "Python 3.7+ required"
    print(f"Python version: {sys.version}")
    

def test_required_packages():
    """Verify required packages are available"""
    try:
        import selenium
        print(f"Selenium version: {selenium.__version__}")
        assert selenium.__version__ is not None
    except ImportError:
        pytest.fail("Selenium package not installed")
    
    try:
        import webdriver_manager
        print("webdriver-manager available")
    except ImportError:
        pytest.fail("webdriver-manager package not installed")


def test_project_files():
    """Verify required project files exist"""
    project_root = Path(__file__).parent.parent.parent
    
    required_files = [
        "admin-prototype.html",
        "pytest.ini",
        "requirements.txt"
    ]
    
    for file in required_files:
        file_path = project_root / file
        assert file_path.exists(), f"Required file missing: {file}"
        print(f"Found: {file}")


def test_test_structure():
    """Verify test project structure"""
    test_dir = Path(__file__).parent.parent
    
    required_dirs = [
        "administration",
        "page_objects", 
        "helpers"
    ]
    
    for dir_name in required_dirs:
        dir_path = test_dir / dir_name
        assert dir_path.exists(), f"Required directory missing: {dir_name}"
        print(f"Found directory: {dir_name}")


@pytest.mark.smoke
def test_basic_browser_setup():
    """Test basic browser driver setup without opening browser"""
    try:
        from selenium import webdriver
        from selenium.webdriver.edge.service import Service
        from selenium.webdriver.edge.options import Options
        from webdriver_manager.microsoft import EdgeChromiumDriverManager
        
        # Test that we can get the driver path (without starting browser)
        driver_path = EdgeChromiumDriverManager().install()
        assert driver_path is not None, "Could not install Edge driver"
        print(f"Edge driver available at: {driver_path}")
        
        # Test options configuration
        options = Options()
        options.add_argument("--headless")
        assert options is not None, "Could not create browser options"
        print("Browser options configured successfully")
        
    except Exception as e:
        pytest.fail(f"Browser setup failed: {str(e)}")


if __name__ == "__main__":
    """Run smoke tests directly"""
    print("Running smoke tests...")
    pytest.main([__file__, "-v", "-s"])