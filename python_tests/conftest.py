"""
Pytest configuration file for E2E Communication Platform tests
"""
import pytest
from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from webdriver_manager.chrome import ChromeDriverManager
import time
import os
from pathlib import Path

from config import TestConfig

@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    """Setup test environment before running tests"""
    TestConfig.ensure_directories()
    print(f"\n🚀 Setting up test environment...")
    print(f"📁 Project root: {TestConfig.PROJECT_ROOT}")
    print(f"🌐 Browser: {TestConfig.BROWSER}")
    print(f"👁️ Headless: {TestConfig.HEADLESS}")
    yield
    print(f"\n✅ Test environment cleanup completed")

@pytest.fixture(scope="function")
def driver():
    """Create and configure WebDriver instance"""
    print(f"\n🌐 Starting {TestConfig.BROWSER} browser...")
    
    driver_instance = None
    
    try:
        if TestConfig.BROWSER.lower() == "edge":
            options = EdgeOptions()
            if TestConfig.HEADLESS:
                options.add_argument("--headless")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-web-security")
            options.add_argument("--allow-running-insecure-content")
            options.add_argument("--disable-features=VizDisplayCompositor")
            
            service = Service(EdgeChromiumDriverManager().install())
            driver_instance = webdriver.Edge(service=service, options=options)
            
        elif TestConfig.BROWSER.lower() == "chrome":
            options = ChromeOptions()
            if TestConfig.HEADLESS:
                options.add_argument("--headless")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-web-security")
            options.add_argument("--allow-running-insecure-content")
            
            service = ChromeService(ChromeDriverManager().install())
            driver_instance = webdriver.Chrome(service=service, options=options)
        
        else:
            raise ValueError(f"Unsupported browser: {TestConfig.BROWSER}")
        
        # Configure driver timeouts
        driver_instance.implicitly_wait(TestConfig.IMPLICIT_WAIT)
        driver_instance.set_page_load_timeout(TestConfig.PAGE_LOAD_TIMEOUT)
        driver_instance.maximize_window()
        
        yield driver_instance
        
    except Exception as e:
        print(f"❌ Error setting up browser: {str(e)}")
        raise
    finally:
        if driver_instance:
            print(f"🔒 Closing browser...")
            driver_instance.quit()

@pytest.fixture(scope="function")
def admin_page(driver):
    """Navigate to admin prototype page"""
    print(f"📄 Loading admin prototype page...")
    driver.get(TestConfig.ADMIN_PROTOTYPE_URL)
    
    # Add slow motion delay if enabled
    if TestConfig.SLOW_MOTION:
        time.sleep(TestConfig.SLOW_MOTION_DELAY)
    
    return driver

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Take screenshot on test failure"""
    outcome = yield
    rep = outcome.get_result()
    
    if rep.when == "call" and rep.failed:
        driver = None
        try:
            # Get the driver from the test
            if hasattr(item, 'funcargs'):
                driver = item.funcargs.get('driver')
            
            if driver and TestConfig.TAKE_SCREENSHOTS and TestConfig.SCREENSHOT_ON_FAILURE:
                test_name = item.name
                screenshot_path = TestConfig.SCREENSHOT_PATH / f"{test_name}_failure.png"
                driver.save_screenshot(str(screenshot_path))
                print(f"📸 Screenshot saved: {screenshot_path}")
                
        except Exception as e:
            print(f"❌ Failed to take screenshot: {str(e)}")

def pytest_configure(config):
    """Configure pytest settings"""
    # Add custom markers
    config.addinivalue_line("markers", "user_management: Tests for user management functionality")
    config.addinivalue_line("markers", "role_management: Tests for role management functionality") 
    config.addinivalue_line("markers", "settings: Tests for settings functionality")
    config.addinivalue_line("markers", "smoke: Smoke tests")
    config.addinivalue_line("markers", "regression: Regression tests")
    config.addinivalue_line("markers", "slow: Slow running tests")

def slow_action(seconds=None):
    """Helper function to add delays between actions"""
    if TestConfig.SLOW_MOTION:
        delay = seconds if seconds else TestConfig.SLOW_MOTION_DELAY
        time.sleep(delay)

# Make slow_action available to tests
@pytest.fixture
def slow_action_fixture():
    """Fixture to provide slow action helper"""
    return slow_action